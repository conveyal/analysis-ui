
export type Feed = any

export type LonLat = {
  lon: number,
  lat: number
}

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

export type Pattern = any

export type Route = any

export type Stop = any

export type ProfileRequest = {
  accessModes: string[],
  directModes: string[],
  fromTime: number,
  toTime: number,
  fromLat: number,
  fromLon: number
}
