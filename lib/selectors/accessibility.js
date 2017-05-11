import {createSelector} from 'reselect'

const POSITION = 10

function computeAccessibility (travelTimeSurface, isochroneCutoff, destinationGrid) {
  if (travelTimeSurface == null ||
    destinationGrid == null ||
    travelTimeSurface.zoom !== destinationGrid.zoom ||
    travelTimeSurface.west !== destinationGrid.west ||
    travelTimeSurface.north !== destinationGrid.north ||
    travelTimeSurface.width !== destinationGrid.width ||
    travelTimeSurface.height !== destinationGrid.height) return null

  let accessibility = 0

  // y on outside, loop in order, hope the CPU figures this out and prefetches
  for (let y = 0; y < destinationGrid.height; y++) {
    for (let x = 0; x < destinationGrid.width; x++) {
      if (travelTimeSurface.get(x, y)[POSITION] < isochroneCutoff) {
        accessibility += destinationGrid[y * destinationGrid.width + x]
      }
    }
  }

  return accessibility
}

export const accessibility = createSelector(
  state => state.analysis.travelTimeSurface,
  state => state.analysis.isochroneCutoff,
  state => state.analysis.destinationGrid,
  computeAccessibility
)

export const comparisonAccessibility = createSelector(
  state => state.analysis.comparisonTravelTimeSurface,
  state => state.analysis.isochroneCutoff,
  state => state.analysis.destinationGrid,
  computeAccessibility
)
