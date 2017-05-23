import multi from '@conveyal/woonerf/store/multi'
import promise from '@conveyal/woonerf/store/promise'
import {middleware as fetchMiddleware} from '@conveyal/woonerf/fetch'
import configureStore from 'redux-mock-store'
import thunkMiddleware from 'redux-thunk'

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
      currentBundle: {
        id: '1'
      },
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
    request: mockProfileRequest
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
    request: mockProfileRequest
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
