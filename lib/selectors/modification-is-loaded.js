import {createSelector} from 'reselect'

const selectScenario = (state) => state.scenario
const selectModification = (_, props) => props.modification
const selectFeedsById = createSelector(
  selectScenario,
  (scenario) => scenario.feedsById
)
const selectActiveFeed = createSelector(
  selectModification,
  (modification) => modification.feed
)

export default createSelector(
  [selectFeedsById, selectActiveFeed],
  (feedsById, feed) => feed ? !!feedsById[feed] : true
)
