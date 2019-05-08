import React from 'react'
import memoize from 'lodash/memoize'
import omit from 'lodash/omit'

import SelectFeedRouteAndPatterns from './select-feed-route-and-patterns'

const filterOutPatterns = memoize(update => modification =>
  update(omit(modification, ['patterns']))
)

/**
 * Select routes or trips to remove
 */
export default function RemoveTrips({
  feeds,
  modification,
  routePatterns,
  selectedFeed,
  updateAndRetrieveFeedData
}) {
  return (
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
}
