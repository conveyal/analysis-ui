import fill from 'lodash/fill'
import times from 'lodash/times'
import {createSelector} from 'reselect'

import {activeOpportunityDatasetGrid} from 'lib/modules/opportunity-datasets/selectors'

const MAX_TRIP_DURATION = 120

function computePercentile({grid, percentileIndex, travelTimeSurface}) {
  const dataThisPercentile = fill(Array(MAX_TRIP_DURATION + 1), 0)
  const north = grid.north - travelTimeSurface.north
  const west = grid.west - travelTimeSurface.west

  // y on outside, loop in order, hope the CPU figures this out and prefetches
  for (let y = 0; y < grid.height; y++) {
    const travelTimeY = y + north
    if (travelTimeY < 0 || travelTimeY >= travelTimeSurface.height) continue
    for (let x = 0; x < grid.width; x++) {
      const travelTimeX = x + west
      if (travelTimeX < 0 || travelTimeX >= travelTimeSurface.width) continue
      const travelTime = travelTimeSurface.get(
        travelTimeX,
        travelTimeY,
        percentileIndex
      )
      // Less than (<) is correct here. Times are floored on the server when
      // converted from seconds to minutes, so a travel time of 59m59s will have
      // a value of 59, not 60.
      if (travelTime < MAX_TRIP_DURATION) {
        dataThisPercentile[travelTime] += grid.getValue(x, y)
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
export function computePercentileCurves({travelTimeSurface, grid}) {
  const perccentileCurves = times(travelTimeSurface.depth, (percentileIndex) =>
    computePercentile({
      grid,
      percentileIndex,
      travelTimeSurface
    })
  )

  // If the accessbility was calculated on the server side this array will exist.
  if (Array.isArray(travelTimeSurface.accessibility)) {
    const destinationPointSetIndex = 0 // Only one destination point set is currently used.
    console.log('client side', perccentileCurves)
    console.log(
      'server side',
      travelTimeSurface.accessibility[destinationPointSetIndex]
    )
    return travelTimeSurface.accessibility[destinationPointSetIndex]
  }

  return perccentileCurves
}

export default createSelector(
  (state) => state.analysis.travelTimeSurface,
  activeOpportunityDatasetGrid,
  (travelTimeSurface, grid) =>
    travelTimeSurface && grid
      ? computePercentileCurves({grid, travelTimeSurface})
      : undefined
)
