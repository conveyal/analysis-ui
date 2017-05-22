import {createSelector} from 'reselect'

import selectActiveModification from './active-modification'
import selectModificationFeed from './modification-feed'

const selectRoutesById = createSelector(
  selectModificationFeed,
  (feed = {}) => feed.routesById
)

export default createSelector(
  selectRoutesById,
  selectActiveModification,
  (routesById, modification) =>
    routesById && modification.routes && routesById[modification.routes[0]]
)
