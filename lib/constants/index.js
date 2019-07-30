export const ENV = process.env.NODE_ENV
export const isServer = typeof window === 'undefined'

/**
 * Logo
 */
export const LOGO_URL =
  'https://d2f1n6ed3ipuic.cloudfront.net/conveyal-128x128.png'
export const CB_HEX = '#2389c9'
export const CB_RGB = {r: 35, g: 137, b: 201}

/**
 * API URLs
 */
export const API_URL = `${process.env.API_URL}/api`

export const API = {
  Analysis: `${API_URL}/analysis`,
  Bundle: `${API_URL}/bundle`,
  GraphQL: `${API_URL}/graphql`,
  Jobs: `${API_URL}/jobs`,
  Modification: `${API_URL}/modification`,
  Opportunities: `${API_URL}/opportunities`,
  Project: `${API_URL}/project`,
  Region: `${API_URL}/region`,
  Regional: `${API_URL}/regional`,
  Timetables: `${API_URL}/timetables`,
  Workers: `${API_URL}/workers`
}
export const ANALYSIS_URL = `${API_URL}/analysis`

/**
 * Routes
 */
export const RouteTo = {
  regions: '/',
  regionCreate: '/regions/create',
  regionSettings: '/regions/[regionId]/edit',
  projects: '/regions/[regionId]',
  projectCreate: '/regions/[regionId]/create-project',
  projectSettings: '/regions/[regionId]/projects/[projectId]/edit',
  report: '/report',
  bundles: '/regions/[regionId]/bundles',
  bundleCreate: '/regions/[regionId]/bundles/create',
  bundleEdit: '/regions/[regionId]/bundles/[bundleId]',
  opportunities: '/regions/[regionId]/opportunities',
  opportunitiesUpload: '/regions/[regionId]/opportunities/upload',
  importShapefile: '/regions/[regionId]/projects/[projectId]/import-shapefile',
  modificationEdit:
    '/regions/[regionId]/projects/[projectId]/modifications/[modificationId]',
  modificationImport:
    '/regions/[regionId]/projects/[projectId]/import-modifications',
  modifications: '/regions/[regionId]/projects/[projectId]',
  analysis: '/regions/[regionId]/analysis',
  regionalAnalyses: '/regions/[regionId]/regional',
  regionalAnalysis: '/regions/[regionId]/regional/[analysisId]',
  login: '/login',
  logout: '/logout',
  authCallback: '/callback'
}

/**
 * Local Storage Keys
 */
export const LS_MOM = 'modifications-on-map'

/**
 * Map
 */
export const PROJECTION_ZOOM_LEVEL = 9

/**
 * Line Editing and display
 */
export const NEW_LINE_WEIGHT = 3
export const HIGHLIGHTED_LINE_WEIGHT = NEW_LINE_WEIGHT * 2
export const NEW_STOP_RADIUS = 2.5

/**
 * Modification types
 */
export const ADD_TRIP_PATTERN = 'add-trip-pattern'
export const ADJUST_DWELL_TIME = 'adjust-dwell-time'
export const ADJUST_SPEED = 'adjust-speed'
export const CONVERT_TO_FREQUENCY = 'convert-to-frequency'
export const CUSTOM_MODIFICATION = 'custom'
export const REMOVE_STOPS = 'remove-stops'
export const REMOVE_TRIPS = 'remove-trips'
export const REROUTE = 'reroute'
export const MODIFICATION_TYPES = [
  ADD_TRIP_PATTERN,
  ADJUST_DWELL_TIME,
  ADJUST_SPEED,
  CONVERT_TO_FREQUENCY,
  REMOVE_STOPS,
  REMOVE_TRIPS,
  REROUTE,
  CUSTOM_MODIFICATION
]

/**
 * Transit Modes
 */
export const BUS = 'BUS'
export const RAIL = 'RAIL'
export const TRAM = 'TRAM'
export const SUBWAY = 'SUBWAY'
export const FERRY = 'FERRY'
export const CABLE_CAR = 'CABLE_CAR'
export const GONDOLA = 'GONDOLA'
export const FUNICULAR = 'FUNICULAR'

// The mode index corresponds to the GTFS route_type integer
export const ALL_TRANSIT_MODES = [
  TRAM,
  SUBWAY,
  RAIL,
  BUS,
  FERRY,
  CABLE_CAR,
  GONDOLA,
  FUNICULAR
]

/**
 * Fetch types
 */
export const FETCH_TRAVEL_TIME_SURFACE = 'FETCH_TRAVEL_TIME_SURFACE'

/**
 * Default values
 */
export const DEFAULT_ADD_STOPS_DWELL = 0
export const DEFAULT_ADJUST_DWELL_TIME_VALUE = 30
export const DEFAULT_ADJUST_SPEED_SCALE = 1
export const DEFAULT_STOP_SPACING_METERS = 400
export const MINIMUM_SNAP_STOP_ZOOM_LEVEL = 12
export const MINIMUM_STOP_SPACING = 50

/**
 * Map states
 */
export const MAP_STATE_TRANSIT_EDITOR = 'map state transit editor'
export const MAP_STATE_HIGHLIGHT_SEGMENT = 'map state highlight segment'
export const MAP_STATE_HIGHLIGHT_STOP = 'map state highlight stop'
export const MAP_STATE_HOP_SELECTION = 'map state hop selection'
export const MAP_STATE_STOP_SELECTION = 'map state stop selection'
export const MAP_STATE_SINGLE_STOP_SELECTION = 'map state single stop selection'
export const MAP_STATE_SELECT_FROM_STOP = 'map state select from stop'
export const MAP_STATE_SELECT_TO_STOP = 'map state select to stop'

/**
 * Update delay so that we can batch updates to the server with debounce
 */
export const UPDATE_DELAY_MS = 1000

/**
 * For autosaving modifications.
 */
export const AUTOSAVE_EVERY_MS = 10 * 1000

/**
 * Percentiles of travel time to request from the backend. This is for
 * TRAVEL_TIME_SURFACE requests.
 */
export const TRAVEL_TIME_PERCENTILES = [5, 25, 50, 75, 95]

/**
 * Default Profile Request object
 */
export const PROFILE_REQUEST_DEFAULTS = {
  accessModes: 'WALK',
  bikeSpeed: 4.166666666666667,
  date: new Date().toISOString().split('T')[0],
  directModes: 'WALK',
  egressModes: 'WALK',
  fromTime: 25200,
  maxRides: 4,
  maxTripDurationMinutes: 60,
  monteCarloDraws: 200,
  percentiles: TRAVEL_TIME_PERCENTILES,
  toTime: 32400,
  transitModes: 'BUS,TRAM,RAIL,SUBWAY,FERRY,CABLE_CAR,GONDOLA,FUNICULAR',
  travelTimePercentile: 50,
  walkSpeed: 1.3888888888888888,
  variantIndex: 0
}

export const UNDEFINED_PROJECT_NAME = 'Not set'
