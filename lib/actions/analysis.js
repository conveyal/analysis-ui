import omit from 'lodash.omit'
import {createAction} from 'redux-actions'

import {serverAction} from './network'
import convertToR5Modification from '../utils/convert-to-r5-modification'

const setAnalysisResults = createAction('set analysis results')
const setFetchStatus = createAction('set fetch status')

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

export const fetchIsochrone = (opts) =>
  serverAction({
    options: {
      body: serializeProfileRequest(opts),
      method: 'post'
    },
    url: '/api/analysis/enqueue/single',
    next: async (response) => {
      const results = await response.json()
      if (response.status === 200) {
        return setAnalysisResults(results)
      } else {
        return fetchIsochrone(opts)
      }
    },
    onError: async (err, response) => {
      const results = await response.text()
      console.log(err)
      console.log(results)
      return setFetchStatus(results)
    }
  })
