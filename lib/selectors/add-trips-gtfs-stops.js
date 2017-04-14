import {createSelector} from 'reselect'

import {ADD_TRIP_PATTERN} from '../constants'
import selectModification from './modification'

export default createSelector(
  [selectModification, (state) => state],
  (modification, state) => {
    return modification.type === ADD_TRIP_PATTERN
      ? segmentStops(modification.segments, state.scenario.feedsById)
      : []
  }
)

function segmentStops (segments, feedsById = {}) {
  const feedStopIds = [...new Set(segments.reduce((stops, segment) =>
    [...stops, segment.fromStopId, segment.toStopId]))]
  return feedStopIds
    .filter((fsi) => !!fsi)
    .map((fsi) => fsi.split(':'))
    .map(([feedId, stopId]) => feedsById[feedId]
      ? feedsById[feedId].stopsById[stopId]
      : {stop_id: stopId, stop_name: stopId})
}
