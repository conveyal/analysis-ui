// @flow

export type LonLat = {
  lon: number,
  lat: number
}

export type ReactSelectResult = {
  label: string,
  value: string
}

export type ClearableReactSelectResult = null | ReactSelectResult

export type ReactSelectMultiResult = ReactSelectResult[]

export type ClearableReactSelectMultiResult = null | ReactSelectMultiResult

/**
 * GeoJSON types
 */
export type Geometry = {
  coordinates: number[][]
}

export type Feature = {
  geometry: Geometry
}

export type FeatureCollection = {
  type: 'FeatureCollection',
  features: Feature[]
}

export type LineString = {
  type: 'LineString',
  coordinates: number[][]
}

/**
 * GTFS Types
 */
export type GTFSStop = {
  stop_id: string,
  stop_lat: number,
  stop_lon: number,
  stop_name: string
}

export type Feed = {
  id: string,
  routes: Array<{
    label: string,
    route_id: string
  }>,
  stopsById: Object
}

export type Bundle = {
  name: string
}

export type Scenario = {
  name: string
}

export type MapState = {
  activeTrips?: number[],
  action?: string,
  followRoad?: boolean,
  state: null | string
}

export type Timetable = {
  dwellTime: number,
  dwellTimes?: number[],
  id: string,
  name: string,
  headwaySecs: number,
  phaseFromTimetable: string,
  phaseFromStop: string,
  phaseAtStop: null | string,
  phaseSeconds: number,
  segmentSpeeds: number[],
  startTime: number,
  endTime: number,
  exactTimes: boolean
}

export type TimetableWithModification = Timetable & {
  modificationId: string,
  modificationName: string
}

export type Pattern = {
  geometry?: any
}

export type Route = {}

export type RoutePattern = {
  name: string,
  pattern_id: string,
  trips: Array<{
    trip_id: string
  }>
}

export type RoutePatterns = RoutePattern[]

export type Segment = {
  fromStopId: string,
  geometry: any,
  spacing: number,
  stopAtEnd: boolean,
  stopAtStart: boolean,
  toStopId: null | string
}

export type ADD_TRIP_PATTERN = 'add-trip-pattern'
export type ADJUST_DWELL_TIME = 'adjust-dwell-time'
export type ADJUST_SPEED = 'adjust-speed'
export type CONVERT_TO_FREQUENCY = 'convert-to-frequency'
export type REMOVE_STOPS = 'remove-stops'
export type REMOVE_TRIPS = 'remove-trips'
export type REROUTE = 'reroute'
export type ModificationType = ADD_TRIP_PATTERN
  | ADJUST_DWELL_TIME
  | ADJUST_SPEED
  | CONVERT_TO_FREQUENCY
  | REMOVE_STOPS
  | REMOVE_TRIPS
  | REROUTE

type BaseModification = {|
  description: string,
  entries?: any,
  feed: string,
  id: string,
  name: string,
  timetables?: any,
  type: ModificationType,
  variants: boolean[]
|}

export type AddTripPattern = {|
  description: string,
  feed: string,
  id: string,
  name: string,
  fromStop?: string,
  toStop?: string,
  bidirectional: boolean,
  timetables: Timetable[],
  segments: Segment[],
  type: ADD_TRIP_PATTERN,
  variants: boolean[]
|}

export type AdjustDwellTime = {|
  description: string,
  feed: string,
  id: string,
  name: string,
  routes: null | string[],
  scale: boolean,
  trips: string[],
  type: ADJUST_DWELL_TIME,
  value: number,
  variants: boolean[]
|}

export type AdjustSpeed = {|
  description: string,
  feed: string,
  id: string,
  name: string,
  routes: null | string[],
  trips: string[],
  hops: null | number,
  scale: number,
  type: ADJUST_SPEED,
  variants: boolean[]
|}

export type ConvertToFrequency = {|
  description: string,
  feed: string,
  id: string,
  name: string,
  entries: Timetable[],
  routes: null | string[],
  retainTripsOutsideFrequencyEntries: boolean,
  type: CONVERT_TO_FREQUENCY,
  variants: boolean[]
|}

export type RemoveStops = {|
  description: string,
  feed: string,
  id: string,
  name: string,
  routes: null | string[],
  trips: string[],
  secondsSavedAtEachStop: number,
  type: REMOVE_STOPS,
  variants: boolean[]
|}

export type RemoveTrips = {|
  description: string,
  feed: string,
  id: string,
  name: string,
  routes: null | string[],
  trips: string[],
  type: REMOVE_TRIPS,
  variants: boolean[]
|}

export type Reroute = {|
  description: string,
  dwellTime: number,
  feed: string,
  id: string,
  name: string,
  fromStop: null | string,
  toStrop: null | string,
  bidirectional: boolean,
  routes: null | string[],
  trips: string[],
  timetables: Timetable[],
  segments: Segment[],
  segmentSpeeds: number[],
  type: REROUTE,
  variants: boolean[]
|}

export type Modification =
    BaseModification
  | AddTripPattern
  | AdjustDwellTime
  | AdjustSpeed
  | ConvertToFrequency
  | RemoveStops
  | RemoveTrips
  | Reroute

export type ProfileRequest = {
  accessModes: string,
  directModes: string,
  fromTime: number,
  toTime: number,
  fromLat: number,
  fromLon: number,
  transitModes: 'TRANSIT' | ''
}

export type Bookmark = {
  destinationGrid: string,
  id: string,
  isochroneCutoff: number,
  name: string,
  profileRequest: ProfileRequest
}

export type Stop = {
  center: number[],
  stopId: null | string,
  index: number,
  lat: number,
  lon: number,
  bearing: boolean | number,
  autoCreated: boolean,
  distanceFromStart: number
}

export type Bounds = {
  north: number,
  east: number,
  south: number,
  west: number
}

export type Project = {
  name: string,
  id: string,
  description: string,
  r5Version: string,
  bounds: Bounds,
  group?: string,
  loadStatus?: string,
  bundles?: any[],
  bookmarks?: any[],
  indicators: any[]
}

// Analysis types
export type AggregationArea = {
  id: string,
  name: string
}

export type AggregateAccessibility = {
  weightedAverage: number,
  minAccessibility: number,
  maxAccessibility: number,
  percentiles: number[],
  bins: {
    min: number,
    max: number,
    value: number
  }[]
}

export type Grid = {
  zoom: number,
  width: number,
  height: number,
  west: number,
  north: number,
  data: number[],
  min: number,
  contains (x: number, y: number): boolean
}

export type Indicator = {
  key: string,
  name: string
}

export type RegionalAnalysis = {
  zoom: number,
  width: number,
  height: number,
  north: number,
  west: number,
  request: any, // TODO
  name: string,
  workerVersion: string,
  bundleId: string,
  bounds: any, // TODO geojson geometry

  // assigned by server
  creationTime: ?number,
  complete: ?boolean,
  scenarioId: ?string,
  deleted: ?boolean,
  status: string,
  id: string,
  grid: string,
  cutoffMinutes: number,
  travelTimePercentile: number
}

export type Quintiles = {
  low: number,
  iqrLow: number,
  med: number,
  iqrHigh: number,
  high: number
}
