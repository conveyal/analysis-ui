import omit from 'lodash.omit'
import lonlng from 'lonlng'
import {createAction} from 'redux-actions'

import {serverAction} from './network'
import convertToR5Modification from '../utils/convert-to-r5-modification'

import {crc32} from 'crc'

export const clearIsochroneResults = createAction('clear isochrone results')
export const setIsochroneCutoff = createAction('set isochrone cutoff')
export const setIsochroneFetchStatus = createAction('set isochrone fetch status')
export const setIsochroneLatLng = createAction('set isochrone latlng', (x) => lonlng(x))
export const setIsochroneResults = createAction('set isochrone results')

/**
 * Action that serializes the request, hashes an id for it, set's the fetching status to true and calls a request function that will keep retrying until the id changes (a new request has come in) or the request returns a 200 and a result.
 */

let lastRequestId = null
export const fetchIsochrone = (opts) => {
  const request = serializeProfileRequest(opts)
  const id = lastRequestId = `${request.profileRequest.scenario.id}-${lonlng.toString(opts.latlng)}`

  return [
    setIsochroneLatLng(opts.latlng),
    setIsochroneFetchStatus(true),
    requestIsochrone(id, JSON.stringify(request))
  ]
}

/**
 * Turn the modifications, latlng, scenario id, and other options into something the server will understand.
 */

function serializeProfileRequest (opts) {
  const today = new Date()
  const PROFILE_REQUEST_DEFAULTS = {
    date: today.toISOString().split('T')[0],
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

  const modifications = (opts.modifications || []).map(convertToR5Modification)
  const checksum = crc32(JSON.stringify(modifications))

  return {
    destinationPointsetId: opts.destinationPointsetId,
    graphId: opts.bundleId,
    type: opts.type || 'analyst',
    workerVersion: opts.workerVersion || 'v1.5.0-60-g43551e4',
    profileRequest: omit({
      ...PROFILE_REQUEST_DEFAULTS,
      ...opts,
      fromLat: opts.latlng.lat,
      fromLon: opts.latlng.lng,
      scenario: {
        id: `${opts.scenarioId}-${checksum}`,
        modifications
      }
    }, ['bundleId', 'latlng', 'modifications', 'scenarioId'])
  }
}

/**
 * Request an isochrone, on failure, keep trying.
 */

function requestIsochrone (id, body) {
  return serverAction({
    options: {
      body,
      method: 'post'
    },
    url: '/api/analysis/enqueue/single',
    next: async (response) => {
      if (id === lastRequestId) {
        if (response.status === 200) {
          const results = await response.json()
          return [
            setIsochroneFetchStatus(false),
            setIsochroneResults(results)
          ]
        } else {
          await timeout(3000)
          return requestIsochrone(id, body)
        }
      }
    },
    onError: async (err, response) => {
      window.alert(err)
      console.error(err)
      return setIsochroneFetchStatus(false)
    }
  })
}

/**
 * Simple promise based timeout
 */

function timeout (time) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, time)
  })
}
