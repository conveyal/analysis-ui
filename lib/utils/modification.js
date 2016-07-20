import toCapitalCase from 'to-capital-case'
import uuid from 'uuid'

import {ADD_STOPS, ADD_TRIP_PATTERN, ADJUST_DWELL_TIME, ADJUST_SPEED, CONVERT_TO_FREQUENCY, REMOVE_STOPS, REMOVE_TRIPS, SET_TRIP_PHASING} from './modification-types'

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
    id: uuid.v4(),
    name: toCapitalCase(type),
    scenario: scenarioId,
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
        feed: feedId,
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
        feed: feedId,
        stops: null,
        trips: null,
        value: DEFAULT_ADJUST_DWELL_TIME_VALUE
      }
    case ADJUST_SPEED:
      return {
        ...base,
        hops: null,
        feed: feedId,
        routes: null,
        scale: DEFAULT_ADJUST_SPEED_SCALE,
        trips: null
      }
    case CONVERT_TO_FREQUENCY:
      return {
        ...base,
        entries: [],
        feed: feedId,
        routes: null
      }
    case REMOVE_STOPS:
      return {
        ...base,
        routes: null,
        feed: feedId,
        stops: null,
        trips: null
      }
    case REMOVE_TRIPS:
      return {
        ...base,
        routes: null,
        feed: feedId,
        trips: null
      }
    case SET_TRIP_PHASING:
      return {
        ...base,
        phaseSeconds: DEFAULT_SET_TRIP_PHASING_PHASE_SECONDS,
        feed: feedId
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
