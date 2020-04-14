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
  (feeds = [], feedId) => {
    console.log('MF', feedId)
    console.log('MFEEDS', feeds)
    const mf = feeds.find(feed => feed.id === feedId)
    console.log('MOdIFEED', mf)
    return mf
  }
)
