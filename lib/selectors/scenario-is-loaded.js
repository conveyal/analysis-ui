// @flow
import {createSelector} from 'reselect'

import selectBundle from './current-bundle'
import selectScenario from './current-scenario'

const selectFeeds = (state) => state.scenario.feeds

export default createSelector(
  [selectBundle, selectFeeds, selectScenario],
  (bundle, feeds, scenario) => bundle && scenario && feeds && feeds.length > 0
)
