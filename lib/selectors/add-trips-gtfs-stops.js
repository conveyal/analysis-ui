import {createSelector} from 'reselect'

import selectActiveModification from './active-modification'
import {ADD_TRIP_PATTERN} from '../constants'

export default createSelector(
  [selectActiveModification, state => state],
  (modification, state) => {
    return modification.type === ADD_TRIP_PATTERN
      ? segmentStops(modification.segments, state.scenario.feedsById)
      : []
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
        : {stop_id: `${feedId}:${stopId}`, stop_name: stopId})
  )
}
