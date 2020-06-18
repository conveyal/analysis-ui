import React from 'react'

import colors from 'lib/constants/colors'

import {NumberInput} from '../input'
import PatternLayer from '../modifications-map/pattern-layer'
import StopLayer from '../modifications-map/stop-layer'

import SelectFeedRouteAndPatterns from './select-feed-route-and-patterns'
import SelectStops from './select-stops'

/**
 * Change dwell times
 */
export default function AdjustDwellTimeComponent(p) {
  function _onPatternSelectorChange({feed, routes, trips}) {
    p.updateAndRetrieveFeedData({feed, routes, trips, stops: null})
  }

  // We are setting a scale for existing speeds, not an actual speed
  function _setScale(e) {
    if (e.currentTarget.checked) p.update({scale: true})
  }

  // We are setting a brand-new speed, throwing out any existing variation in speed.
  function _setSpeed(e) {
    if (e.currentTarget.checked) p.update({scale: false})
  }

  // Set the factor by which we are scaling, or the speed which we are replacing.
  function _setValue(e) {
    p.update({value: e.currentTarget.value})
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
        nullIsWildcard
        selectedColor={colors.MODIFIED}
      />

      <SelectFeedRouteAndPatterns
        onChange={_onPatternSelectorChange}
        routes={p.modification.routes}
        trips={p.modification.trips}
      />

      {p.modification.routes && (
        <SelectStops setMapState={p.setMapState} update={p.update} />
      )}

      <div className='radio'>
        <label htmlFor='adjust-dwell-time-scale'>
          <input
            id='adjust-dwell-time-scale'
            type='radio'
            value='scale'
            checked={p.modification.scale}
            onChange={_setScale}
          />{' '}
          Scale existing dwell times by
        </label>
      </div>
      <div className='radio'>
        <label htmlFor='adjust-dwell-time-speed'>
          <input
            id='adjust-dwell-time-speed'
            type='radio'
            value='speed'
            checked={!p.modification.scale}
            onChange={_setSpeed}
          />{' '}
          Set new dwell time to
        </label>
      </div>

      <NumberInput
        min={0}
        onChange={_setValue}
        units={p.modification.scale ? ' ' : 'seconds'}
        value={p.modification.value}
      />
    </>
  )
}
