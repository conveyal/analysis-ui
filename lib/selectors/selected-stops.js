import {createSelector} from 'reselect'

import selectFeedStopsById from './feed-stops-by-id'
import selectModification from './modification'

const selectStopIds = createSelector(
  selectModification,
  (modification) => modification.stops || []
)

export default createSelector(
  selectFeedStopsById,
  selectStopIds,
  (stopsById, stopIds) => stopIds.map((stopId) => stopsById[stopId])
)
