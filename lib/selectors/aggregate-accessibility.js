// @flow
/** Selector to compute the weighted average accessibility value from a regional analysis */

import range from 'lodash.range'
import {createSelector} from 'reselect'

import type {Grid} from '../types'

const N_HISTOGRAM_BINS = 15

/** Compute the accessibility, exported for use in comparison-weighted-average-accessibility
 * @param weights a grid containing the weights (e.g. population)
 * @param mask a grid containing the mask, with the percentage the mask overlaps each cell, scaled between 0 (no overlap) and 100,000 (full coverage)
 * @param accessibility a grid containing the accessibility (i.e. the regional analysis results)
 */
export function getAggregateAccessibility (accessibility: Grid, mask: Grid, weights: Grid) {
  if (weights == null || mask == null || accessibility == null) return

  if (accessibility.zoom !== weights.zoom || accessibility.zoom !== mask.zoom) {
    console.error('Zoom levels of all grids in weighted average must match!')
  }

  // find max and min value for histogram
  let maxAccessibility = 0
  let minAccessibility = Infinity

  // pass one: find min and max from mask
  // mask is probably the smallest grid and is guaranteed to contain all pixels
  for (let y = 0, pixel = 0; y < mask.height; y++) {
    // transform to coordinates in other grid; all grids have same zoom, so just translate
    // based on the difference in where the edges of the grid are
    const accessY = y + mask.north - accessibility.north
    for (let x = 0; x < mask.width; x++, pixel++) {
      if (mask.data[pixel] > 0) {
        const accessX = x + mask.west - accessibility.west
        const accessibilityThisCell = accessibility.contains(accessX, accessY)
          ? accessibility.data[accessY * accessibility.width + accessX]
          : 0

        minAccessibility = Math.min(accessibilityThisCell, minAccessibility)
        maxAccessibility = Math.max(accessibilityThisCell, maxAccessibility)
      }
    }
  }

  const spread = maxAccessibility - minAccessibility
  const bins = range(N_HISTOGRAM_BINS).map(i => 0)

  let sumOfWeights = 0
  // weight and accessibility value for each cell, used to compute percentiles
  const weightedAccessibility = []

  // pass two: accumulate into bins
  for (let y = 0, pixel = 0; y < mask.height; y++) {
    const accessY = y + mask.north - accessibility.north
    const weightY = y + mask.north - weights.north
    for (let x = 0; x < mask.width; x++, pixel++) {
      if (mask.data[pixel] > 0) {
        const accessX = x + mask.west - accessibility.west
        const accessibilityThisCell = accessibility.contains(accessX, accessY)
          ? accessibility.data[accessY * accessibility.width + accessX]
          : 0

        let binIndex = Math.floor(
          (accessibilityThisCell - minAccessibility) /
            spread *
            N_HISTOGRAM_BINS)

        if (binIndex > N_HISTOGRAM_BINS) console.error('invalid bin!')

        // avoid putting the highest accessibility cell beyond the histogram
        if (binIndex === N_HISTOGRAM_BINS) binIndex--

        const maskWeightThisCell = mask.data[pixel] / 100000 // how much of this cell is within the mask

        const weightX = x + mask.west - weights.west
        const weightThisCell = weights.contains(weightX, weightY)
          ? weights.data[weightY * weights.width + weightX]
          : 0

        const weight = maskWeightThisCell * weightThisCell
        bins[binIndex] += maskWeightThisCell * weightThisCell

        sumOfWeights += weight
        weightedAccessibility.push({ weight, accessibility: accessibilityThisCell })
      }
    }
  }

  // figure out percentiles
  let cumulativeWeight = 0
  let previousAccessibility = null
  let previousCumulativeWeight = null
  let percentiles = [0] // preinitialize with null so 50th percentile is percentiles[50], there is no zeroth percentile
  let weightPerPercentile = sumOfWeights / 100
  let expectedWeight = weightPerPercentile
  weightedAccessibility.sort((a, b) => a.accessibility - b.accessibility)

  // we loop over the sorted weighted accessibility values. When we cross a percentile boundary,
  // we push that percentile onto the list
  weightedAccessibility.forEach(({ accessibility, weight }) => {
    cumulativeWeight += weight

    // while not if, possible to cross many percentiles with one high-density cell
    while (cumulativeWeight >= expectedWeight) {
      // we have crossed a percentile boundary. Figure out where we crossed, do linear interpolation
      let percentileValue
      if (previousAccessibility == null) {
        // we are at the very start, we have no numbers below, just use this number as the percentile
        percentileValue = accessibility
      } else {
        const frac = (expectedWeight - previousCumulativeWeight) / (cumulativeWeight - previousCumulativeWeight)
        percentileValue = previousAccessibility + (accessibility - previousAccessibility) * frac
      }

      percentiles.push(percentileValue)
      expectedWeight += weightPerPercentile
    }

    previousAccessibility = accessibility
    previousCumulativeWeight = cumulativeWeight
  })

  // includes values 1 - 99
  // when the resolution of the data is low the last item may only define (say) the 90th percentile,
  // all remaining percentiles are just the max
  // also handles the case when there is no accessibility within the aggregation area by returning
  // all zeros
  while (percentiles.length < 99) {
    percentiles.push(weightedAccessibility.length > 0
      ? weightedAccessibility[weightedAccessibility.length - 1].accessibility
      : 0)
  }

  const binWidth = spread / N_HISTOGRAM_BINS

  return {
    minAccessibility,
    maxAccessibility,
    percentiles,
    bins: bins.map((value, idx) => ({
      value,
      min: minAccessibility + idx * binWidth,
      max: minAccessibility + (idx + 1) * binWidth
    }))
  }
}

export default createSelector(
  state => state.analysis.regional.grid,
  state => state.analysis.regional.mask,
  state => state.analysis.regional.maskWeights,
  getAggregateAccessibility
)
