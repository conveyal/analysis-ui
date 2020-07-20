import get from 'lodash/get'
import React from 'react'
import {useSelector} from 'react-redux'

import selectFeeds from 'lib/selectors/feeds-with-bundle-names'
import selectModificationFeed from 'lib/selectors/modification-feed'
import selectRoutePatterns from 'lib/selectors/route-patterns'

import SelectPatterns from './select-patterns'
import SelectFeedAndRoutes from './select-feed-and-routes'

/**
 * Select a (group of) patterns from the GTFS feed
 */
export default function SelectFeedRouteAndPatterns(p) {
  const feeds = useSelector(selectFeeds)
  const routePatterns = useSelector(selectRoutePatterns)
  const selectedFeed = useSelector(selectModificationFeed)

  function _selectTrips(trips) {
    p.onChange({
      feed: get(selectedFeed, 'id'),
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
        feeds={feeds}
        onChange={_selectFeedAndRoutes}
        selectedFeed={selectedFeed}
        selectedRouteIds={p.routes}
      />

      {get(p, 'routes.length') < 2 && routePatterns.length > 0 && (
        <SelectPatterns onChange={_selectTrips} trips={p.trips} />
      )}
    </>
  )
}
