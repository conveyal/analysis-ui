import get from 'lodash/get'
import React from 'react'

import SelectPatterns from './select-patterns'
import SelectFeedAndRoutes from './select-feed-and-routes'

/**
 * Select a (group of) patterns from the GTFS feed
 */
export default function SelectFeedRouteAndPatterns(p) {
  function _selectTrips({trips}) {
    p.onChange({
      feed: get(p.selectedFeed, 'id'),
      routes: p.routes,
      trips
    })
  }

  function _selectFeedAndRoutes({feed, routes}) {
    p.onChange({feed, routes, trips: null})
  }

  return (
    <>
      <SelectFeedAndRoutes
        allowMultipleRoutes={p.allowMultipleRoutes}
        feeds={p.feeds}
        onChange={_selectFeedAndRoutes}
        selectedFeed={p.selectedFeed}
        selectedRouteIds={p.routes}
      />

      {p.routes && p.routes.length < 2 && p.routePatterns.length > 0 && (
        <SelectPatterns
          onChange={_selectTrips}
          routePatterns={p.routePatterns}
          trips={p.trips}
        />
      )}
    </>
  )
}
