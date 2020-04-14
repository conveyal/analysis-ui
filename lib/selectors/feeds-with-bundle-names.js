import get from 'lodash/get'
import {createSelector} from 'reselect'

import selectCurrentBundle from './current-bundle'

export default createSelector(
  state => state.project.feeds,
  selectCurrentBundle,
  (feeds, bundle) => {
    return feeds.map(feed => {
      const bundleFeed = get(bundle, 'feeds', []).find(
        f => f.feedId === feed.id || f.bundleScopedFeedId === feed.id
      )
      return {...feed, name: get(bundleFeed, 'name', feed.id)}
    })
  }
)
