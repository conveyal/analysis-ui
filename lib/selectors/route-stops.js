import {createSelector} from 'reselect'

import selectActiveModification from './active-modification'
import selectFeedStopsById from './feed-stops-by-id'
import selectModificationRoute from './modification-route'

const selectModificationTrips = createSelector(
  selectActiveModification,
  (modification) => modification.trips
)

const selectModificationPatterns = createSelector(
  selectModificationRoute,
  selectModificationTrips,
  (route, trips) =>
    route &&
    (trips && route.patterns
      ? route.patterns.filter(patternTripsInModification(trips))
      : route.patterns)
)

export default createSelector(
  [selectModificationPatterns, selectFeedStopsById],
  (patterns, stopsById) =>
    uniqueStopIds(patterns || []).map(getStopFromFeed(stopsById))
)

export const patternTripsInModification = (modificationTrips) => (pattern) =>
  pattern.trips.find((t) => modificationTrips.indexOf(t.trip_id) > -1)

const uniqueStopIds = (patterns) => [
  ...new Set(
    patterns.reduce(
      (stopIds, pattern) => [
        ...stopIds,
        ...pattern.stops.map((s) => s.stop_id)
      ],
      []
    )
  )
]

export const getStopFromFeed = (feedStopsById) => (stopId) =>
  feedStopsById[stopId]
