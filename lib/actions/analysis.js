import {serverAction} from './network'

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
    workerVersion: opts.workerVersion || 'UNKNOWN',
    profileRequest: {
      ...PROFILE_REQUEST_DEFAULTS,
      ...opts,
      fromLat: opts.latlng.lat,
      fromLon: opts.latlng.lng,
      scenario: {
        id: opts.scenarioId,
        modifications: opts.modifications || []
      }
    }
  }

  // Remove UI data
  delete request.profileRequest.bundleId
  delete request.profileRequest.latlng

  return JSON.stringify(request)
}

export const runSinglePoint = (opts) =>
  serverAction({
    options: {
      body: serializeProfileRequest(opts),
      method: 'post'
    },
    url: '/api/analysis/enqueue/single',
    next: async (response) => {
      const results = await response.json()
      console.log(results)
    },
    onError: async (err, response) => {
      console.log(err)
    }
  })
