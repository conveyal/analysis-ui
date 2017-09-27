// @flow
import {createSelector} from 'reselect'

import selectCurrentBundle from './current-bundle'

export default createSelector(
  state => state.scenario.feeds,
  selectCurrentBundle,
  (feeds, bundle) =>
    feeds.map(feed => {
      const bundleFeed =
        bundle && bundle.feeds.find(({feedId}) => feedId === feed.id)
      return bundleFeed
        ? {...feed, name: bundleFeed.name}
        : {...feed, name: feed.id}
    })
)
