import {createSelector} from 'reselect'

import selectActiveModification from './active-modification'
import selectModifications from './modifications'
import {getStopFromFeed, patternTripsInModification} from './route-stops'

/**
 * Get the timetables for the active modification.
 */
const selectTimetables = createSelector(
  selectActiveModification,
  (modification = {}) =>
    ((modification.entries && modification.entries.length > 0) ||
      (modification.timetables && modification.timetables.length > 0)
      ? (modification.entries || modification.timetables)
        .filter(tt => !!tt.phaseFromTimetable)
        .map(tt => tt.phaseFromTimetable)
      : [])
)

/**
 * Get the modifications in a map of `phaseFromTimetable` -> Modification
 */
const selectPhaseModifications = createSelector(
  [selectTimetables, selectModifications],
  (phaseFromTimetables, modifications) =>
    (phaseFromTimetables && phaseFromTimetables.length > 0
      ? phaseFromTimetables.reduce((_, pft) => {
        _[pft] = modifications.find((m) => m._id === pft.split(':')[0])
        return _
      }, {})
      : {})
)

/**
 * Get stops of the trips in a referenced (not necessarily active) modification
 */
const selectStopsFromTrip = (state, m) => {
  const phaseFromFeed = state.project.feedsById && state.project.feedsById[m.feed]
  if (!phaseFromFeed) return
  const patternStops = phaseFromFeed.routes.find(r => r.route_id === m.routes[0])
      .patterns.find(patternTripsInModification([m.sourceTrip]))
      .stops.map(s => s.stop_id)
  const feedStops = phaseFromFeed.stopsById
  return patternStops.map(getStopFromFeed(feedStops))
}

export default createSelector(
  [selectPhaseModifications, state => state],
  (modifications, state) => {
    const stopsForTimetable = {}
    Object.keys(modifications).forEach(key => {
      const modification = modifications[key]
      if (!modification) return
      if (modification.entries) { // get stops from a referenced adjust-frequency mod (which has entries)
        const entry = modification.entries.find(e => e._id === key.split(':')[1])
        stopsForTimetable[key] = selectStopsFromTrip(
          state,
          {
            ...modification,
            sourceTrip: entry.sourceTrip
          }
        ).map(stop => ({
          ...stop,
          stop_id: `${modification.feed}:${stop.stop_id}`
        }))
      } else { // get stops from a referenced add-trip-pattern mod (which has timetables)
        stopsForTimetable[key] = segmentStops(
          modification.segments,
          state.project.feedsById
        )
      }
    })
    return stopsForTimetable
  }
)

function segmentStops (segments, feedsById = {}) {
  const feedStopIds = [
    ...new Set(
      segments.reduce(
        (stops, segment) => [...stops, segment.fromStopId, segment.toStopId],
        []
      )
    )
  ]
  return feedStopIds.filter(fsi => !!fsi).map(fsi => fsi.split(':')).map(
    ([feedId, stopId]) =>
      (feedsById[feedId]
        ? {
          ...feedsById[feedId].stopsById[stopId],
          stop_id: `${feedId}:${stopId}`
        }
        : {stop_id: `${feedId}:${stopId}`})
  )
}
