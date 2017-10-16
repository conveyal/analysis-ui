import {createSelector} from 'reselect'

import selectModificationRoute from './modification-route'

export default createSelector(
  selectModificationRoute,
  route => (route && route.patterns ? route.patterns : [])
)
