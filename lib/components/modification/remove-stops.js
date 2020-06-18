import React from 'react'

import colors from 'lib/constants/colors'
import message from 'lib/message'

import {NumberInput} from '../input'
import PatternLayer from '../modifications-map/pattern-layer'
import StopLayer from '../modifications-map/stop-layer'

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
      <PatternLayer
        color={colors.NEUTRAL_LIGHT}
        feed={p.selectedFeed}
        modification={p.modification}
      />
      <StopLayer
        feed={p.selectedFeed}
        modification={p.modification}
        selectedColor={colors.REMOVED}
        unselectedColor={colors.NEUTRAL_LIGHT}
      />

      <SelectFeedRouteAndPatterns
        onChange={onPatternSelectorChange}
        routes={p.modification.routes}
        trips={p.modification.trips}
      />

      {p.modification.routes && p.selectedFeed && (
        <SelectStops setMapState={p.setMapState} update={p.update} />
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
