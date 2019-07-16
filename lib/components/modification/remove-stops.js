import React from 'react'

import message from 'lib/message'

import {NumberInput} from '../input'

import SelectFeedRouteAndPatterns from './select-feed-route-and-patterns'
import SelectStops from './select-stops'

/**
 * Remove stops from a route
 */
export default function RemoveStopsComponent(p) {
  function onPatternSelectorChange({feed, routes, trips}) {
    p.updateAndRetrieveFeedData({
      feed,
      routes,
      trips,
      stops: []
    })
  }

  function changeRemoveSeconds(e) {
    const secondsSavedAtEachStop = e.currentTarget.value
    p.update({secondsSavedAtEachStop})
  }

  return (
    <>
      <SelectFeedRouteAndPatterns
        feeds={p.feeds}
        onChange={onPatternSelectorChange}
        routePatterns={p.routePatterns}
        routes={p.modification.routes}
        selectedFeed={p.selectedFeed}
        trips={p.modification.trips}
      />

      {p.modification.routes && p.selectedFeed && (
        <SelectStops
          routeStops={p.routeStops}
          selectedStops={p.selectedStops}
          setMapState={p.setMapState}
          update={p.update}
        />
      )}

      <NumberInput
        label={message('modification.removeStops.removeSeconds')}
        units={message('report.units.second')}
        onChange={changeRemoveSeconds}
        value={p.modification.secondsSavedAtEachStop}
      />
    </>
  )
}
