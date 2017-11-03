// @flow
import {createSelector} from 'reselect'

import selectModificationRoute from './modification-route'

export default createSelector(
  selectModificationRoute,
  (route = {}) => route.patterns || []
)
