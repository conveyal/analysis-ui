import {createSelector} from 'reselect'

import selectFeedsWithBundleNames from './feeds-with-bundle-names'
import selectActiveModification from './active-modification'

const selectActiveFeedId = createSelector(
  selectActiveModification,
  (modification = {}) => modification.feed
)

export default createSelector(
  selectFeedsWithBundleNames,
  selectActiveFeedId,
  (feeds = [], feedId) => feeds.find(feed => feed.id === feedId)
)
