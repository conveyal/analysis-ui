// @flow
import {createSelector} from 'reselect'

import selectModification from './active-modification'
import selectRouteStops from './route-stops'

export default createSelector(
  [selectModification, selectRouteStops],
  (modification, routeStops) =>
    routeStops.map(stop => ({
      ...stop,
      stop_id: `${modification.feed}:${stop.stop_id}`
    }))
)
