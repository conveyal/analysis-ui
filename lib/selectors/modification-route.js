import {createSelector} from 'reselect'

import selectModification from './modification'
import selectModificationFeed from './modification-feed'

const selectRoutesById = createSelector(
  selectModificationFeed,
  (feed = {}) => feed.routesById
)

export default createSelector(
  selectRoutesById,
  selectModification,
  (routesById, modification) =>
    routesById && modification.routes && routesById[modification.routes[0]]
)
