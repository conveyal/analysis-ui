// @flow
import {createSelector} from 'reselect'

import {TRAVEL_TIME_PERCENTILES} from '../constants/analysis'

import type {Grid, TravelTimeSurface} from '../types'

const POSITION = TRAVEL_TIME_PERCENTILES.indexOf(50)

export function computeAccessibility (
  travelTimeSurface: TravelTimeSurface,
  isochroneCutoff: number,
  destinationGrid: Grid
) {
  if (travelTimeSurface == null || destinationGrid == null) return null

  let accessibility = 0

  // y on outside, loop in order, hope the CPU figures this out and prefetches
  for (let y = 0; y < destinationGrid.height; y++) {
    const travelTimeY = y + destinationGrid.north - travelTimeSurface.north
    if (travelTimeY < 0 || travelTimeY >= travelTimeSurface.height) continue
    for (let x = 0; x < destinationGrid.width; x++) {
      const travelTimeX = x + destinationGrid.west - travelTimeSurface.west
      if (travelTimeX < 0 || travelTimeX >= travelTimeSurface.width) continue
      // less than is correct here, times are floored on the server when
      // converted from seconds to minutes, so a travel time of 59m59s will have
      // a value of 59, not 60.
      if (
        travelTimeSurface.get(travelTimeX, travelTimeY)[POSITION] <
        isochroneCutoff
      ) {
        accessibility += destinationGrid.data[y * destinationGrid.width + x]
      }
    }
  }

  return accessibility
}

export default createSelector(
  state => state.analysis.travelTimeSurface,
  state => state.analysis.isochroneCutoff,
  state => state.analysis.destinationGrid,
  computeAccessibility
)
