
export type LonLat = {
  lon: number,
  lat: number
}

/**
 * GeoJSON types
 */
export type Coordinate = [number, number]

export type Feature = any

export type FeatureCollection = {
  type: 'FeatureCollection',
  features: Feature[]
}

export type LineString = {
  type: 'LineString',
  coordinates: Coordinate[]
}

export type Feed = any

export type MapState = any

export type Modification = any

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

export type Pattern = {
  geometry: any
}

export type Route = any

export type Segment = {
  fromStopId: string,
  geometry: LineString,
  spacing: number,
  stopAtEnd: boolean,
  stopAtStart: boolean,
  toStopId?: string
}

export type Stop = {
  stopId: string,
  index: number,
  lat: number,
  lon: number,
  bearing: number,
  autoCreated: boolean,
  distanceFromStart: number
}
