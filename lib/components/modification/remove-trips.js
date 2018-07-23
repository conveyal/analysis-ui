// @flow
import React from 'react'
import memoize from 'lodash/memoize'
import omit from 'lodash/omit'

import SelectFeedRouteAndPatterns from './select-feed-route-and-patterns'

import type {Feed, Modification, RoutePatterns} from '../../types'

type Props = {
  feeds: Feed[],
  modification: Modification,
  routePatterns: RoutePatterns,
  selectedFeed: Feed,
  updateAndRetrieveFeedData(any): void
}

const filterOutPatterns = memoize((update: (any) => void) =>
  (modification: any) =>
    update(omit(modification, ['patterns'])))

/**
 * Select routes or trips to remove
 */
export default ({
  feeds,
  modification,
  routePatterns,
  selectedFeed,
  updateAndRetrieveFeedData
}: Props) => (
  <SelectFeedRouteAndPatterns
    allowMultipleRoutes
    feeds={feeds}
    onChange={filterOutPatterns(updateAndRetrieveFeedData)}
    routePatterns={routePatterns}
    routes={modification.routes}
    selectedFeed={selectedFeed}
    trips={modification.trips}
  />
)
