import {createSelector} from 'reselect'

import selectActiveModification from './active-modification'
import selectFeedStopsById from './feed-stops-by-id'

const selectStopIds = createSelector(
  selectActiveModification,
  (modification) => modification.stops || []
)

export default createSelector(
  selectFeedStopsById,
  selectStopIds,
  (stopsById = {}, stopIds = []) => stopIds.map((stopId) => stopsById[stopId])
)
