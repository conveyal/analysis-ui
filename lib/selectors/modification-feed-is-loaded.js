import get from 'lodash/get'
import {createSelector} from 'reselect'

import selectActiveModification from './active-modification'
import selectModificationFeed from './modification-feed'

export default createSelector(
  selectActiveModification,
  selectModificationFeed,
  (modification, feed) => (get(modification, 'feed') ? !!feed : true)
)
