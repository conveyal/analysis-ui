// @flow
import fill from 'lodash/fill'
import times from 'lodash/times'
import {createSelector} from 'reselect'

import OpportunityDatasets from '../modules/opportunity-datasets'

import type {Grid, TravelTimeSurface} from '../types'

const MAX_TRIP_DURATION = 120

function computePercentile ({
  grid,
  percentile,
  travelTimeSurface
}: {
  grid: Grid,
  percentile: number,
  travelTimeSurface: TravelTimeSurface
}): number[] {
  const dataThisPercentile = fill(Array(MAX_TRIP_DURATION), 0)
  const north = grid.north - travelTimeSurface.north
  const west = grid.west - travelTimeSurface.west

  for (let y = 0; y < grid.height; y++) {
    const travelTimeY = y + north
    if (travelTimeY >= 0 && travelTimeY < travelTimeSurface.height) {
      for (let x = 0; x < grid.width; x++) {
        const travelTimeX = x + west
        if (travelTimeX >= 0 && travelTimeX < travelTimeSurface.width) {
          const surface = travelTimeSurface.get(travelTimeX, travelTimeY)
          const travelTime = surface[percentile]

          if (travelTime < MAX_TRIP_DURATION) {
            // dataThisPercentile[i] is the marginal accessibility from minute i
            // to minute i + 1. Travel times are floored from seconds to minutes
            // on the server so using the floored value as an index is correct.
            dataThisPercentile[travelTime] +=
              grid.data[y * grid.width + x]
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
  grid
}: {
  travelTimeSurface: TravelTimeSurface,
  grid: Grid
}): number[][] {
  return times(travelTimeSurface.nSamples, percentile =>
    computePercentile({
      grid,
      percentile,
      travelTimeSurface
    })
  )
}

export default createSelector(
  state => state.analysis.travelTimeSurface,
  OpportunityDatasets.selectors.selectActiveOpportunityDatasetGrid,
  (travelTimeSurface, grid) =>
    (travelTimeSurface && grid
      ? computePercentileCurves({grid, travelTimeSurface})
      : undefined)
)
