// @flow
import {createSelector} from 'reselect'

import selectActiveModification from './active-modification'

const selectScenario = (state) => state.scenario
const selectFeedsById = createSelector(
  selectScenario,
  (scenario) => scenario.feedsById
)
const selectActiveFeedId = createSelector(
  selectActiveModification,
  (modification) => modification && modification.feed
)

export default createSelector(
  [selectFeedsById, selectActiveFeedId],
  (feedsById, feedId) => feedsById[feedId]
)
