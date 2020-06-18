import React from 'react'
import memoize from 'lodash/memoize'
import omit from 'lodash/omit'

import colors from 'lib/constants/colors'

import PatternLayer from '../modifications-map/pattern-layer'

import SelectFeedRouteAndPatterns from './select-feed-route-and-patterns'

const filterOutPatterns = memoize((update) => (modification) =>
  update(omit(modification, ['patterns']))
)

/**
 * Select routes or trips to remove
 */
export default function RemoveTrips({
  modification,
  selectedFeed,
  updateAndRetrieveFeedData
}) {
  return (
    <>
      <PatternLayer
        color={colors.REMOVED}
        feed={selectedFeed}
        modification={modification}
      />

      <SelectFeedRouteAndPatterns
        allowMultipleRoutes
        onChange={filterOutPatterns(updateAndRetrieveFeedData)}
        routes={modification.routes}
        trips={modification.trips}
      />
    </>
  )
}
