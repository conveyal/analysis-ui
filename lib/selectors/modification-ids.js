// @flow
import {createSelector} from 'reselect'

import selectModifications from './modifications'

export default createSelector(
  selectModifications,
  modifications => modifications.map(modification => modification._id)
)
