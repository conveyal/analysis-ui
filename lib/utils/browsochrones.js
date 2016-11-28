/** Handle interactions with Browsochrones and the cluster */

import Browsochrones, {createGrid} from 'browsochrones'
import {crc32} from 'crc'
import dbg from 'debug'
import uuid from 'uuid'

import convertToR5Modification from './convert-to-r5-modification'
import authenticatedFetch from './authenticated-fetch'

const debug = dbg('scenario-editor:browsochrones')

function assert (e, msg) {
  if (!e) throw new Error(msg)
}

export const PROFILE_REQUEST_DEFAULTS = {
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
  monteCarloDraws: 1000
}

// Map from scenario ID to object containing Browsochrones instance, hash of last used scenario
// x, y coords of origin
const instances = new Map()

// Grids are shared among all Browsochrones instances
// array should contain { name, grid }
let grids

/** { name: <Browsochrones grid object>}, TODO combine with grids, don't build these in every thread */
let processedGrids

/** export a function to get the grids so that they can be retrieved after being set */
export const getGrids = () => processedGrids

/** get a new Browsochrones instance with grids already loaded */
async function createInstanceAndPutGrids (grids) {
  assert(grids, 'Grids must be loaded to create a Browosochrones instance.')
  debug('no browsochrones instance for current scenario, creating one and loading grids')
  const browsochrones = new Browsochrones()
  await Promise.all(grids.map(({ grid, name }) => browsochrones.putGrid(name, grid)))
  debug('created browsochrones instance for scenario')
  return browsochrones
}

/** Set the grids being used, in the format [{name, grid}...] */
export function setGrids (newGrids) {
  assert(instances.size === 0, 'Grids cannot be set after Browsochrones instances have been created.')

  grids = newGrids
  processedGrids = new Map()

  // make a local copy, making sure to slice since the process of creating a grid is destructive
  grids.forEach(({ name, grid }) => processedGrids.set(name, createGrid(grid.slice())))
}

/**
 * Get an R5 profile request for a scenario.
 * TODO we need to add a lot more options to this function (date, time, worker version)
 */
function getStaticSiteRequest ({ modifications, bundleId, scenarioUniqueId, workerVersion }) {
  return {
    transportNetworkId: bundleId, // TODO is this necessary?
    workerVersion,
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
async function ensureScenarioLoadedForInstance ({
  bundleId,
  instance,
  modifications,
  scenarioId,
  workerVersion
}) {
  // hash the modifications to detect any changes that have taken place
  const scenarioHash = crc32(JSON.stringify(modifications))

  // Maybe one day we'll check if anything relevant (the street network) has changed,
  // that would be a performance win
  if (scenarioHash !== instance.scenarioHash || workerVersion !== instance.workerVersion) {
    debug(`scenario ${scenarioId} has changed, updating browsochrones`)
    const scenarioUniqueId = `${scenarioId}-${scenarioHash}`
    const request = getStaticSiteRequest({ modifications, bundleId, scenarioUniqueId, workerVersion })
    // TODO don't duplicate these fields
    const { jobId } = request
    const body = {
      request,
      graphId: bundleId,
      workerVersion,
      jobId
    }

    const metadata = await authenticatedFetch('/api/analysis/enqueue/single', {
      method: 'POST',
      body: JSON.stringify({ ...body, type: 'static-metadata' })
    }, true).then(res => res.json())

    // technically we shouldn't need to retry here as the worker is started once the above request
    // succeeds, but why not.
    const stopTrees = await authenticatedFetch('/api/analysis/enqueue/single', {
      method: 'POST',
      body: JSON.stringify({ ...body, type: 'static-stop-trees' })
    }, true).then(res => res.arrayBuffer())

    const { browsochrones } = instance

    await Promise.all([
      browsochrones.setQuery(metadata),
      browsochrones.setStopTrees(stopTrees),
      browsochrones.setTransitiveNetwork(metadata.transitive) // TODO shouldn't have to do this.
    ])

    instance.staticSiteRequest = request
    instance.scenarioHash = scenarioHash
    instance.workerVersion = workerVersion
    instance.origin = { x: -1, y: -1 }

    instance.indicator = instance.spectrogramData = null

    debug(`(re-)loaded scenario ${scenarioId}`)
  }

  return instance
}

/**
 * Ensure that an origin is loaded and a surface has been generated.
 * Assumes that the proper scenario/stop trees have been loaded with ensureScenarioLoaded
 */
async function ensureOriginLoadedForInstance ({
  instance,
  origin
}) {
  const {x, y} = instance.browsochrones.latLonToOriginPoint(origin)
  if (!instance.origin || instance.origin.x !== x || instance.origin.y !== y) {
    debug(`fetching origin (${x}, ${y}) for scenario ${instance.scenarioHash}`)

    // TODO don't duplicate these fields
    const { workerVersion, jobId, transportNetworkId } = instance.staticSiteRequest
    const body = {
      request: instance.staticSiteRequest,
      graphId: transportNetworkId,
      workerVersion,
      jobId,
      x,
      y,
      type: 'static'
    }

    // always possible that the worker has died in the meantime, use retryFetch
    const origin = await authenticatedFetch('/api/analysis/enqueue/single', {
      method: 'POST',
      body: JSON.stringify(body)
    }, true).then(res => res.arrayBuffer())

    await instance.browsochrones.setOrigin(origin, { x, y })
    await instance.browsochrones.generateSurface()
    instance.origin = { x, y }
    instance.indicator = instance.spectrogramData = null
  }

  return instance
}

/** Get the spectrogram data, caching if possible */
async function getSpectrogramData ({
  indicator,
  instance
}) {
  // this catches nulls as well
  if (instance.indicator !== indicator) {
    instance.spectrogramData = await instance.browsochrones.getSpectrogramData(indicator)
    instance.indicator = indicator
  }

  return instance.spectrogramData
}

/** Get isochrones and accessibility numbers for a scenario and a given cutoff. Modifications is in scenario-editor format. */
export async function getIsochronesAndAccessibility ({
  bundleId,
  indicator,
  isochroneCutoff,
  modifications,
  origin,
  scenarioId,
  workerVersion
}) {
  const instance = instances.has(scenarioId)
    ? instance.get(scenarioId)
    : {browsochrones: await createInstanceAndPutGrids(grids)}
  instances.set(scenarioId, instance)

  await ensureScenarioLoadedForInstance({bundleId, grids, instance, modifications, scenarioId, workerVersion})
  await ensureOriginLoadedForInstance({instance, origin})
  const {browsochrones} = instance
  return {
    isochrone: await browsochrones.getIsochrone(isochroneCutoff, false),
    accessibility: await browsochrones.getAccessibilityForGrid(indicator, isochroneCutoff),
    spectrogramData: await getSpectrogramData({indicator, instance}),
    indicator,
    isochroneCutoff
  }
}

/** clear all browsochrones instances when changing projects */
export function clear () {
  instances.clear()
}
