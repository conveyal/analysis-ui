import {createSelector} from 'reselect'

import selectActiveModification from './active-modification'
import selectModificationFeed from './modification-feed'

export default createSelector(
  selectActiveModification,
  selectModificationFeed,
  (modification, feed) => modification.feed ? !!feed : true
)
