import toCapitalCase from 'to-capital-case'
import uuid from 'uuid'

export const ADD_STOPS = 'add-stops'
export const ADD_TRIP_PATTERN = 'add-trip-pattern'
export const ADJUST_DWELL_TIME = 'adjust-dwell-time'
export const ADJUST_SPEED = 'adjust-speed'
export const CONVERT_TO_FREQUENCY = 'convert-to-frequency'
export const REMOVE_STOPS = 'remove-stops'
export const REMOVE_TRIPS = 'remove-trips'
export const SET_TRIP_PHASING = 'set-trip-phasing'

const DEFAULT_ADD_STOPS_DWELL = 0
const DEFAULT_ADD_STOPS_SPEED = 15
const DEFAULT_ADJUST_DWELL_TIME_VALUE = 30
const DEFAULT_ADJUST_SPEED_SCALE = 1
const DEFAULT_SET_TRIP_PHASING_PHASE_SECONDS = 15 * 60 // fifteen minutes

export function create ({
  feedId,
  scenarioId,
  type,
  variants
}) {
  const base = {
    expanded: true,
    feed: feedId,
    id: uuid.v4(),
    name: toCapitalCase(type),
    scenarioId,
    showOnMap: true,
    type,
    variants
  }
  switch (type) {
    case ADD_STOPS:
      return {
        ...base,
        dwell: DEFAULT_ADD_STOPS_DWELL,
        fromStop: null,
        routes: null,
        segments: [],
        speed: DEFAULT_ADD_STOPS_SPEED,
        toStop: null
      }
    case ADD_TRIP_PATTERN:
      return {
        ...base,
        segments: [],
        timetables: []
      }
    case ADJUST_DWELL_TIME:
      return {
        ...base,
        routes: null,
        scale: false,
        stops: null,
        trips: null,
        value: DEFAULT_ADJUST_DWELL_TIME_VALUE
      }
    case ADJUST_SPEED:
      return {
        ...base,
        hops: null,
        routes: null,
        scale: DEFAULT_ADJUST_SPEED_SCALE,
        trips: null
      }
    case CONVERT_TO_FREQUENCY:
      return {
        ...base,
        entries: [],
        routes: null
      }
    case REMOVE_STOPS:
      return {
        ...base,
        routes: null,
        stops: null,
        trips: null
      }
    case REMOVE_TRIPS:
      return {
        ...base,
        routes: null,
        trips: null
      }
    case SET_TRIP_PHASING:
      return {
        ...base,
        phaseSeconds: DEFAULT_SET_TRIP_PHASING_PHASE_SECONDS
      }
  }
}

export function formatForServer (modification) {
  const copy = Object.assign({}, modification)
  const feedIsObject = copy.feed && copy.feed.id
  const routesAreObjects = copy.routes && copy.routes[0] && copy.routes[0].id
  const stopsAreObjects = copy.stops && copy.stops[0] && copy.stops[0].id
  const tripsAreObjects = copy.trips && copy.trips[0] && copy.trips[0].id

  if (feedIsObject) copy.feed = copy.feed.id
  if (routesAreObjects) copy.routes = copy.routes.map((route) => route.id)
  if (stopsAreObjects) copy.stops = copy.stops.map((stop) => stop.id)
  if (tripsAreObjects) copy.trips = copy.trips.map((trip) => trip.id)
  return copy
}
