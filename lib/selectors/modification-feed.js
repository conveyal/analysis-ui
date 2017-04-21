import {createSelector} from 'reselect'

const selectScenario = (state) => state.scenario
const selectModification = (_, props) => props.modification
const selectFeedsById = createSelector(
  selectScenario,
  (scenario) => scenario.feedsById
)
const selectActiveFeedId = createSelector(
  selectModification,
  (modification) => modification.feed
)

export default createSelector(
  [selectFeedsById, selectActiveFeedId],
  (feedsById, feedId) => feedId && feedsById[feedId]
)
