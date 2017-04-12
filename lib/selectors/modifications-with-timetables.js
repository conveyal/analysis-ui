import {createSelector} from 'reselect'

import selectModification from './modification'
import selectModifications from './modifications'

export default createSelector(
  [selectModification, selectModifications],
  (modification, modifications) =>
    modifications
      .filter((m) => m.id !== modification.id)
      .filter((m) => m.entries && m.entries.length > 0)
)
