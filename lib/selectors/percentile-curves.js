// @flow
import fill from 'lodash/fill'
import times from 'lodash/times'
import {createSelector} from 'reselect'

import type {Grid, TravelTimeSurface} from '../types'

const MAX_TRIP_DURATION = 120

function computePercentile ({
  destinationGrid,
  percentile,
  travelTimeSurface
}: {
  destinationGrid: Grid,
  percentile: number,
  travelTimeSurface: TravelTimeSurface
}): number[] {
  const dataThisPercentile = fill(Array(MAX_TRIP_DURATION), 0)
  const north = destinationGrid.north - travelTimeSurface.north
  const west = destinationGrid.west - travelTimeSurface.west

  for (let y = 0; y < destinationGrid.height; y++) {
    const travelTimeY = y + north
    if (travelTimeY >= 0 && travelTimeY < travelTimeSurface.height) {
      for (let x = 0; x < destinationGrid.width; x++) {
        const travelTimeX = x + west
        if (travelTimeX >= 0 && travelTimeX < travelTimeSurface.width) {
          const surface = travelTimeSurface.get(travelTimeX, travelTimeY)
          const travelTime = surface[percentile]

          if (travelTime < MAX_TRIP_DURATION) {
            // dataThisPercentile[i] is the marginal accessibility from minute i
            // to minute i + 1. Travel times are floored from seconds to minutes
            // on the server so using the floored value as an index is correct.
            dataThisPercentile[travelTime] +=
              destinationGrid.data[y * destinationGrid.width + x]
          }
        }
      }
    }
  }

  // make non-cumulative
  for (let i = 1; i < dataThisPercentile.length; i++) {
    dataThisPercentile[i] += dataThisPercentile[i - 1]
  }

  return dataThisPercentile
}

/**
 * Percentile curves data is an array of cumulative accessibility curves for
 * different percentiles.
 */
export function computePercentileCurves ({
  travelTimeSurface,
  destinationGrid
}: {
  travelTimeSurface: TravelTimeSurface,
  destinationGrid: Grid
}): number[][] {
  return times(travelTimeSurface.nSamples, percentile =>
    computePercentile({
      destinationGrid,
      percentile,
      travelTimeSurface
    })
  )
}

export default createSelector(
  state => state.analysis.travelTimeSurface,
  state => state.analysis.destinationGrid,
  (travelTimeSurface, destinationGrid) =>
    (travelTimeSurface && destinationGrid
      ? computePercentileCurves({travelTimeSurface, destinationGrid})
      : undefined)
)
