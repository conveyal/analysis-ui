import {createSelector} from 'reselect'

import selectActiveModification from './active-modification'
import routeStops from './route-stops'

const selectTimetables = createSelector(
  selectActiveModification,
  modification =>
    (modification.entries && modification.entries.length > 0) ||
    (modification.timetables && modification.timetables.length > 0)
      ? (modification.entries || modification.timetables)
          .filter(tt => !!tt.phaseFromTimetable)
          .map(tt => tt.phaseFromTimetable)
      : []
)

const selectModifications = createSelector(
  [selectTimetables, state => state.scenario.modificationsById],
  (phaseFromTimetables, modificationsById) =>
    phaseFromTimetables && phaseFromTimetables.length > 0
      ? phaseFromTimetables.reduce((_, pft) => {
        _[pft] = modificationsById[pft.split(':')[0]]
        return _
      }, {})
      : {}
)

export default createSelector(
  [selectModifications, state => state],
  (modifications, state) => {
    const stopsForTimetable = {}
    Object.keys(modifications).forEach(key => {
      const modification = modifications[key]
      if (!modification) return
      if (modification.entries) {
        const entry = modification.entries.find(e => e.id === key.split(':')[1])
        stopsForTimetable[key] = routeStops(state, {
          modification: {
            ...modification,
            trips: entry.patternTrips
          }
        }).map(stop => ({
          ...stop,
          stop_id: `${modification.feed}:${stop.stop_id}`
        }))
      } else {
        stopsForTimetable[key] = segmentStops(
          modification.segments,
          state.scenario.feedsById
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
      feedsById[feedId]
        ? {
          ...feedsById[feedId].stopsById[stopId],
          stop_id: `${feedId}:${stopId}`
        }
        : {stop_id: `${feedId}:${stopId}`}
  )
}
