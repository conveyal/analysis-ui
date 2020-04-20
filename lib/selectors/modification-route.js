import {createSelector} from 'reselect'

import selectActiveModification from './active-modification'
import selectModificationFeed from './modification-feed'

const selectRoutes = createSelector(
  selectModificationFeed,
  (feed = {}) => feed.routes
)

export default createSelector(
  selectRoutes,
  selectActiveModification,
  (routes = [], modification = {}) =>
    routes.find((r) => r.route_id === (modification.routes || [])[0])
)
