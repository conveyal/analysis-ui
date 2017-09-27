// @flow
import React from 'react'

import SelectFeedRouteAndPatterns from './select-feed-route-and-patterns'

import type {Feed, RemoveTrips, RoutePatterns} from '../../types'

type Props = {
  feeds: Feed[],
  modification: RemoveTrips,
  routePatterns: RoutePatterns,
  selectedFeed: Feed,
  update(any): void
}

/**
 * Select routes or trips to remove
 */
export default ({
  feeds,
  modification,
  routePatterns,
  selectedFeed,
  update
}: Props) => (
  <SelectFeedRouteAndPatterns
    feeds={feeds}
    onChange={update}
    routePatterns={routePatterns}
    routes={modification.routes}
    selectedFeed={selectedFeed}
    trips={modification.trips}
  />
)
