import multi from '@conveyal/woonerf/store/multi'
import promise from '@conveyal/woonerf/store/promise'
import {middleware as fetchMiddleware} from '@conveyal/woonerf/fetch'
import configureStore from 'redux-mock-store'
import thunkMiddleware from 'redux-thunk'
import {TextEncoder} from 'text-encoding'

import {ADD_TRIP_PATTERN} from '../constants'

export const makeMockStore = configureStore([fetchMiddleware, multi, promise, thunkMiddleware])

export const mockSegmentGeom = {
  type: 'LineString',
  coordinates: [
    [
      -122.0246,
      36.9707
    ],
    [
      -122.0279,
      37.049
    ],
    [
      -121.9799,
      37.2299
    ],
    [
      -121.9445,
      37.324
    ],
    [
      -121.936,
      37.353
    ],
    [
      -121.924,
      37.365
    ]
  ]
}

export const mockSegment = {
  type: 'Feature',
  properties: {},
  geometry: mockSegmentGeom
}

const mockStop1 = {
  stop_id: '1',
  stop_lat: 36.9707,
  stop_lon: -122.0246,
  stop_name: 'Santa Cruz'
}

const mockStop2 = {
  stop_id: '2',
  stop_lat: 37.049,
  stop_lon: -122.0279,
  stop_name: 'Scotts Valley'
}

export const mockStops = [mockStop1, mockStop2]

export const mockPattern = {
  geometry: mockSegmentGeom,
  stops: mockStops,
  trips: [
    {
      trip_id: 'abcd',
      start_time: 12345,
      trip_short_name: 'The Express',
      trip_headsign: 'To Downtown',
      duration: 1234
    }
  ]
}

export const mockRoute = {
  id: 'route1',
  patterns: [mockPattern]
}

export const mockFeed = {
  id: '1',
  routes: [mockRoute],
  routesById: {
    route1: mockRoute
  },
  stopsById: {
    '1': mockStop1,
    '2': mockStop2
  }
}

export const mockMapState = {
  allowExtend: true,
  extendFromEnd: true,
  followRoad: true,
  state: 'add-trip-pattern',
  modificationId: '1234'
}

export const mockTimetable = {
  name: 'Test timetable',
  segmentSpeeds: [],
  dwellTime: 10,
  monday: true,
  tuesday: true,
  wednesday: true,
  thursday: true,
  friday: true,
  saturday: false,
  sunday: false,
  headwaySecs: 900, // 15 minutes
  startTime: 28800, // 8am
  endTime: 57600, // 4pm
  patternTrips: ['abcd'],
  sourceTrip: 'abcd'
}

export const mockModification = {
  bidirectional: false,
  entries: [],
  feed: mockFeed.id,
  id: '1234',
  name: 'Test Modification',
  routes: ['route1'],
  segments: [],
  showOnMap: false,
  timetables: [mockTimetable],
  trips: ['abcd'],
  type: ADD_TRIP_PATTERN,
  variants: [0]
}

export const mockProject = {
  bounds: {
    north: 39,
    east: -76,
    south: 38,
    west: -77
  },
  description: 'Project description',
  id: '1',
  name: 'Mock Project'
}

export const mockScenario = {
  bundleId: '1',
  feeds: [mockFeed],
  feedsById: {
    [mockFeed.id]: mockFeed
  },
  id: '1',
  name: 'Mock Scenario',
  projectId: '1',
  variants: ['Default']
}

export const mockStores = {
  init: {
    analysis: {
      isFetchingIsochrone: false,
      isochroneCutoff: 60
    },
    mapState: {
      activeTrips: [],
      center: {
        lat: 38.8886,
        lon: -77.043
      },
      components: [],
      zoom: 12
    },
    network: {
      error: null,
      outstandingRequests: 0
    },
    project: {
      currentProject: null,
      projects: [],
      projectsById: {}
    },
    routing: {
      locationBeforeTransitions: null
    },
    scenario: {
      bundles: [],
      bundlesById: {},
      currentBundle: null,
      currentScenario: mockScenario,
      feeds: [mockFeed],
      feedsById: {
        [mockFeed.id]: mockFeed
      },
      modifications: [mockModification],
      modificationsById: {
        [mockModification.id]: mockModification
      },
      modificationsByType: {
        [mockModification.type]: [mockModification]
      },
      scenarios: [],
      scenariosById: {},
      variants: ['Default']
    },
    user: {
      idToken: null
    }
  }
}

export const mockScenarioApplicationError = {
  'modificationId': 'Add Trip Pattern',
  'title': "Error while applying the modification entitled 'Add Trip Pattern'.",
  'messages': [
    'Headway is not greater than zero.'
  ]
}

export const mockProfileRequest = {
  date: '2016-01-16',
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
  monteCarloDraws: 200,
  maxRides: 4
}

export const mockRegionalAnalyses = [
  {
    zoom: 9,
    width: 300,
    height: 300,
    north: 20024,
    west: 20015,
    name: 'ANALYSIS 1',
    grid: 'Jobs_total',
    scenarioId: '1234',
    variant: 0,
    bundleId: '5678',
    cutoffMinutes: 60,
    id: 'abcd',
    request: mockProfileRequest,
    // percentile -1 indicates this analysis was done using Andrew Owen-style average instantaneous accessibility
    travelTimePercentile: -1
  },
  {
    zoom: 9,
    width: 300,
    height: 300,
    north: 20024,
    west: 20015,
    name: 'ANALYSIS 2',
    grid: 'Jobs_total',
    scenarioId: '4321',
    variant: 1,
    bundleId: '5678',
    cutoffMinutes: 60,
    id: 'efgh',
    request: mockProfileRequest,
    travelTimePercentile: 42
  }
]

export const mockGrid = {
  zoom: 9,
  width: 300,
  height: 300,
  north: 20024,
  west: 20015,
  data: [],
  min: 0,
  max: 2000
}

export const mockBookmark = {
  name: 'Bookmark',
  profileRequest: mockProfileRequest,
  isochroneCutoff: 42,
  destinationGrid: 'Workers_total',
  projectId: 'PROJECT'
}

export const mockSurfaceParameters = {
  width: 5,
  height: 5,
  nSamples: 20,
  zoom: 9,
  north: 40000,
  west: 40000
}

// initialize in function so that extra vars don't leak out of scope
export const mockSurfaceData = (() => {
  const {width, height, nSamples, zoom, north, west} = mockSurfaceParameters

  const metadata = {
    scenarioApplicationWarnings: [mockScenarioApplicationError]
  }

  const metadataEncoded = new TextEncoder().encode(JSON.stringify(metadata))
  const bufSize = 9 * 4 + // header
    width * height * nSamples * 4 + // data
    metadataEncoded.length // metadata

  const buffer = new ArrayBuffer(bufSize)
  const surfaceData = new Int32Array(buffer, 0, 9 + width * height * nSamples)

  // text header ("ACCESSGR")
  surfaceData[0] = 1162036033 // ACCE
  surfaceData[1] = 1380406099 // SSGR

  // version
  surfaceData[2] = 0

  surfaceData[3] = zoom
  surfaceData[4] = west
  surfaceData[5] = north
  surfaceData[6] = width
  surfaceData[7] = height
  surfaceData[8] = nSamples

  // phew, header is done
  for (let y = 0, pixel = 9; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let prev = 0
      for (let z = 0; z < nSamples; z++, pixel++) {
        const pixelVal = getMockSurfaceValue(x, y, z)
        surfaceData[pixel] = pixelVal - prev // values are delta-coded within each pixel
        prev = pixelVal
      }
    }
  }

  // copy metadata
  const metadataBuffer = new Uint8Array(buffer, buffer.byteLength - metadataEncoded.byteLength, metadataEncoded.length)
  for (let i = 0; i < metadataEncoded.length; i++) {
    metadataBuffer[i] = metadataEncoded[i]
  }

  return buffer
})()

// Return the value that should be stored in sample z of pixel x, y of the mock surface
export function getMockSurfaceValue (x, y, z) {
  // max possible value is 92 - x and y are in [0, 4], and z is in [0, 19] 4 * 4 + 4 * 19 = 92
  return x * y + z * y
}
