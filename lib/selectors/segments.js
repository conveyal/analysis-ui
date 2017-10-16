// @flow
import {createSelector} from 'reselect'

import selectActiveModification from './active-modification'

export default createSelector(
  selectActiveModification,
  (modification = {}) => modification.segments || []
)
