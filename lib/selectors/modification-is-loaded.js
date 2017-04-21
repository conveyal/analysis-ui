import {createSelector} from 'reselect'

import selectModification from './modification'
import selectModificationFeed from './modification-feed'

export default createSelector(
  selectModification,
  selectModificationFeed,
  (modification, feed) => modification.feed ? !!feed : true
)
