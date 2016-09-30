import omit from 'lodash.omit'
import {createAction} from 'redux-actions'

import {serverAction} from './network'
import convertToR5Modification from '../utils/convert-to-r5-modification'

export const clearIsochroneResults = createAction('clear isochrone results')
export const setIsochroneCutoff = createAction('set isochrone cutoff')
export const setIsochroneFetchStatus = createAction('set isochrone fetch status')
export const setIsochroneLatLng = createAction('set isochrone latlng')
export const setIsochroneResults = createAction('set isochrone results')

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

  const request = {
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
        id: opts.scenarioId,
        modifications: (opts.modifications || []).map(convertToR5Modification)
      }
    }, ['bundleId', 'latlng', 'modifications'])
  }

  return JSON.stringify(request)
}

export const fetchIsochrone = (opts) => {
  return [
    setIsochroneFetchStatus(true),
    serverAction({
      options: {
        body: serializeProfileRequest(opts),
        method: 'post'
      },
      url: '/api/analysis/enqueue/single',
      next: async (response) => {
        const results = await response.json()
        if (response.status === 200) {
          return [
            setIsochroneFetchStatus(false),
            setIsochroneResults(results)
          ]
        } else {
          await timeout(2000)
          return fetchIsochrone(opts)
        }
      },
      onError: async (err, response) => {
        window.alert(err)
        console.error(err)
        return setIsochroneFetchStatus(false)
      }
    })
  ]
}

function timeout (time) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, time)
  })
}
