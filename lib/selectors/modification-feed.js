// @flow
import get from 'lodash/get'
import {createSelector} from 'reselect'

import selectActiveModification from './active-modification'

const selectActiveFeedId = createSelector(
  selectActiveModification,
  (modification = {}) => modification.feed
)

export default createSelector(
  (state) => get(state, 'project.feeds'),
  selectActiveFeedId,
  (feeds = [], feedId) => feeds.find((feed) => feed.id === feedId)
)
