import {createSelector} from 'reselect'

import selectBundle from './current-bundle'
import selectProject from './current-project'

const selectFeeds = state => state.project.feeds

export default createSelector(
  [selectBundle, selectFeeds, selectProject],
  (bundle, feeds, project) => bundle && project && feeds && feeds.length > 0
)
