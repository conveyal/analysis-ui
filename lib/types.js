// @flow
/* eslint-disable no-use-before-define */

export type Model = {
  _id: string,
  accessGroup: string,
  createdAt: string,
  createdBy: string,
  name: string,
  updatedAt: string,
  updatedBy: string,
}

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
  checksum: string,
  id: string,
  routes: Route[],
  stops: any[],
  stopsById: Object
}

export type Bundle = {
  _id: string,
  feeds: Array<{
    checksum: string,
    feedId: string,
    name: string
  }>,
  name: string,
  projectId: string,
  totalFeeds: number
}

export type Scenario = {
  _id: string,
  bundleId: string,
  name: string
}

export type MapState = {
  activeTrips?: number[],
  action?: string,
  followRoad?: boolean,
  state: null | string
}

export type Timetable = {
  timetableId: string,
  timetableId: string,
  dwellTime: number,
  dwellTimes?: number[],
  name: string,
  headwaySecs: number,
  phaseFromTimetable: string,
  phaseFromStop: string,
  phaseAtStop: null | string,
  phaseSeconds: number,
  segmentSpeeds: number[],
  startTime: number,
  endTime: number,
  exactTimes: boolean,
  modificationId: string,
  modificationName: string
}

export type Pattern = {
  geometry?: any
}

export type Route = {
  label: string,
  route_id: string,
  patterns: any[]
}

export type Trip = {
  duration: number,
  trip_id: string,
  start_time: number,
  end_time: number,
  trip_short_name: string,
  trip_headsign: string
}

export type RoutePattern = {
  name: string,
  pattern_id: string,
  trips: Trip[],
  geometry?: any
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
export type ModificationType =
  | ADD_TRIP_PATTERN
  | ADJUST_DWELL_TIME
  | ADJUST_SPEED
  | CONVERT_TO_FREQUENCY
  | REMOVE_STOPS
  | REMOVE_TRIPS
  | REROUTE

type BaseModification = {|
  _id: string,
  description: string,
  entries?: any,
  feed: string,
  name: string,
  scenarioId: string,
  showOnMap: boolean,
  routes?: void | string[],
  timetables?: any,
  type: ModificationType,
  variants: boolean[]
|}

export type AddTripPattern = BaseModification & {|
  feed: string,
  fromStop: null | string,
  toStop: null | string,
  bidirectional: boolean,
  timetables: Timetable[],
  segments: Segment[],
  type: ADD_TRIP_PATTERN
|}

export type AdjustDwellTime = BaseModification & {|
  feed: string,
  routes: void | string[],
  scale: boolean,
  trips: string[],
  type: ADJUST_DWELL_TIME,
  value: number
|}

export type AdjustSpeed = BaseModification & {|
  description: string,
  feed: string,
  name: string,
  routes: void | string[],
  trips: string[],
  hops: void | number,
  scale: number,
  type: ADJUST_SPEED,
  variants: boolean[]
|}

export type ConvertToFrequency = BaseModification & {|
  _id: string,
  description: string,
  feed: string,
  name: string,
  entries: Timetable[],
  routes: void | string[],
  retainTripsOutsideFrequencyEntries: boolean,
  type: CONVERT_TO_FREQUENCY,
  variants: boolean[]
|}

export type RemoveStops = BaseModification & {|
  description: string,
  feed: string,
  _id: string,
  name: string,
  routes: void | string[],
  stops: void | string[],
  trips: string[],
  secondsSavedAtEachStop: number,
  type: REMOVE_STOPS,
  variants: boolean[]
|}

export type RemoveTrips = BaseModification & {|
  description: string,
  feed: string,
  _id: string,
  name: string,
  routes: void | string[],
  trips: string[],
  type: REMOVE_TRIPS,
  variants: boolean[]
|}

export type Reroute = BaseModification & {|
  description: string,
  dwellTime: number,
  feed: string,
  _id: string,
  name: string,
  fromStop: null | string,
  toStrop: null | string,
  bidirectional: boolean,
  routes: void | string[],
  trips: void | string[],
  timetables: Timetable[],
  segments: Segment[],
  segmentSpeeds: number[],
  type: REROUTE,
  variants: boolean[]
|}

export type Modification =
  | BaseModification
  | AddTripPattern
  | AdjustDwellTime
  | AdjustSpeed
  | ConvertToFrequency
  | RemoveStops
  | RemoveTrips
  | Reroute

export type ProfileRequest = {
  accessModes: string,
  egressModes: string,
  directModes: string,
  fromTime: number,
  toTime: number,
  fromLat: number,
  fromLon: number,
  transitModes: string
}

export type Bookmark = {
  _id: string,
  opportunityDataset: string,
  isochroneCutoff: number,
  name: string,
  profileRequest: ProfileRequest,
  projectId: string
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
  _id: string,
  name: string,
  description: string,
  r5Version: string,
  bounds: Bounds,
  accessGroup?: string,
  loadStatus?: string,
  bundles?: any[],
  bookmarks?: any[],
  opportunityDatasets: any[]
}

// Analysis types
export type AggregationArea = {
  _id: string,
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
  contains(x: number, y: number): boolean
}

export type OpportunityDataset = {
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
  _id: string,
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

export type TravelTimeSurface = {
  nSamples: number,
  north: number,
  west: number,
  height: number,
  width: number,
  get: (number, number) => number[]
}
