/** Handle interactions with Browsochrones and the cluster */

import Browsochrones from 'browsochrones'
import {crc32} from 'crc'
import fetch from 'isomorphic-fetch'
import dbg from 'debug'
const debug = dbg('scenario-editor:browsochrones')
import uuid from 'uuid'

import convertToR5Modification from './convert-to-r5-modification'
import authenticatedFetch from './authenticated-fetch'
import timeout from './timeout'

// TODO get from project
const WORKER_VERSION = 'v1.5.0-78-g5d11cf9'

/** How often to retry 202 response from the server */
const RETRY_TIMEOUT_MILLISECONDS = 10 * 1000

const PROFILE_REQUEST_DEFAULTS = {
  date: (new Date()).toISOString().split('T')[0],
  fromTime: 25200,
  toTime: 32400,
  accessModes: 'WALK',
  directModes: 'WALK',
  egressModes: 'WALK',
  transitModes: 'TRANSIT',
  walkSpeed: 1.3888888888888888,
  bikeSpeed: 4.166666666666667,
  carSpeed: 20,
  streetTime: 90,
  maxWalkTime: 20,
  maxBikeTime: 20,
  maxCarTime: 45,
  minBikeTime: 10,
  minCarTime: 10,
  suboptimalMinutes: 5,
  reachabilityThreshold: 0,
  bikeSafe: 1,
  bikeSlope: 1,
  bikeTime: 1,
  bikeTrafficStress: 4,
  boardingAssumption: 'RANDOM',
  monteCarloDraws: 220
}

// Map from scenario ID to object containing Browsochrones instance, hash of last used scenario
// x, y coords of origin
// TODO LRU cache
let instances = new Map()

// Grids are shared among all Browsochrones instances
// array should contain { name, grid }
let grids = null

/** get a new Browsochrones instance with grids already loaded */
async function newInstance () {
  if (grids == null) throw new Error('Grids are not loaded!')

  let browsochrones = new Browsochrones()

  await grids.map(({ grid, name }) => browsochrones.putGrid(name, grid))

  return {
    // CRC of the scenario, used to detect when stop trees and metadata must be refetched
    scenarioHash: null,
    origin: { x: NaN, y: NaN },
    staticSiteRequest: null,
    browsochrones
  }
}

/** Attempt to fetch a file from the server, retrying on a 202 (Worker starting up) response */
async function retryFetch (url, opts, timeoutMs = RETRY_TIMEOUT_MILLISECONDS) {
  let res = await authenticatedFetch(url, opts)

  if (res.status === 202) {
    debug(`202 response from server, retrying in ${timeoutMs / 1000}s`)
    await timeout(timeoutMs)
    return retryFetch(url, opts, timeoutMs)
  }

  return res
}

/** Set the grids being used, in the format [{name, grid}...] */
export function setGrids (newGrids) {
  if (instances.size > 0) throw new Error('attempt to set grids after Browsochrones instances have been created')
  grids = newGrids
}

/**
 * Get an R5 profile request for a scenario.
 * TODO we need to add a lot more options to this function (date, time, worker version)
 */
function getStaticSiteRequest ({ modifications, bundleId, scenarioUniqueId }) {
  return {
    transportNetworkId: bundleId, // TODO is this necessary?
    workerVersion: WORKER_VERSION,
    bucket: null, // don't save to S3
    jobId: uuid.v4(),
    request: {
      ...PROFILE_REQUEST_DEFAULTS,
      scenario: {
        id: scenarioUniqueId,
        modifications: modifications.map(convertToR5Modification)
      }
    }
  }
}

/** Make sure a scenario is loaded and we are ready to generate isochrones, paths, etc. with Browsochrones */
async function ensureScenarioLoaded ({ scenarioId, bundleId, modifications }) {
  // ensure we have a Browsochrones instance for this scenario id
  if (!instances.has(scenarioId)) {
    debug(`no browsochrones instance for scenario ${scenarioId}, creating one and loading grids`)
    instances.set(scenarioId, await newInstance())
    debug(`created browsochrones instance for scenario ${scenarioId}`)
  }

  let instance = instances.get(scenarioId)

  // hash the modifications to detect any changes that have taken place
  let scenarioHash = crc32(JSON.stringify(modifications))

  // Maybe one day we'll check if anything relevant (the street network) has changed,
  // that would be a performance win
  if (scenarioHash !== instance.scenarioHash) {
    debug(`scenario ${scenarioId} has changed, updating browsochrones`)
    let scenarioUniqueId = `${scenarioId}-${scenarioHash}`
    let request = getStaticSiteRequest({ modifications, bundleId, scenarioUniqueId })
    // TODO don't duplicate these fields
    let { workerVersion, jobId } = request
    let body = {
      request,
      graphId: bundleId,
      workerVersion,
      jobId
    }

    let metadata = await retryFetch('/api/analysis/enqueue/single', {
      method: 'POST',
      body: JSON.stringify({ ...body, type: 'static-metadata' })
    }).then(res => res.json())

    // technically we shouldn't need to retry here as the worker is started once the above request
    // succeeds, but why not.
    let stopTrees = await retryFetch('/api/analysis/enqueue/single', {
      method: 'POST',
      body: JSON.stringify({ ...body, type: 'static-stop-trees' })
    }).then(res => res.arrayBuffer())

    let { browsochrones } = instance

    await Promise.all([
      browsochrones.setQuery(metadata),
      browsochrones.setStopTrees(stopTrees),
      browsochrones.setTransitiveNetwork(metadata.transitive) // TODO shouldn't have to do this.
    ])

    instance.staticSiteRequest = request
    instance.scenarioHash = scenarioHash
    instance.origin = { x: -1, y: -1 }

    debug(`(re-)loaded scenario ${scenarioId}`)
  }
}

/**
 * Ensure that an origin is loaded and a surface has been generated.
 * Assumes that the proper scenario/stop trees have been loaded with ensureScenarioLoaded
 */
async function ensureOriginLoaded ({ scenarioId, x, y }) {
  let instance = instances.get(scenarioId)

  if (instance.origin.x !== x || instance.origin.y !== y) {
    debug(`fetching origin (${x}, ${y}) for scenario ID ${scenarioId}`)

    // TODO don't duplicate these fields
    let { workerVersion, jobId, transportNetworkId } = instance.staticSiteRequest
    let body = {
      request: instance.staticSiteRequest,
      graphId: transportNetworkId,
      workerVersion,
      jobId,
      x,
      y,
      type: 'static'
    }

    // always possible that the worker has died in the meantime, use retryFetch
    let origin = await retryFetch('/api/analysis/enqueue/single', {
      method: 'POST',
      body: JSON.stringify(body)
    }).then(res => res.arrayBuffer())

    await instance.browsochrones.setOrigin(origin, { x, y })
    await instance.browsochrones.generateSurface()
    instance.origin = { x, y }
  }
}

/** Get isochrones and accessibility numbers for a scenario and a given cutoff. Modifications is in scenario-editor format. */
export async function getIsochronesAndAccessibility ({ scenarioId, bundleId, modifications, isochroneCutoff, origin }) {
  await ensureScenarioLoaded({ scenarioId, modifications, bundleId })
  let { browsochrones } = instances.get(scenarioId)
  let { x, y } = browsochrones.latLonToOriginPoint(origin)
  await ensureOriginLoaded({ scenarioId, x, y })
  return {
    isochrone: await browsochrones.getIsochrone(isochroneCutoff)
    // TODO accessibility
  }
}

/** clear all browsochrones instances when changing projects */
export function clear () {
  instances = new Map()
}
