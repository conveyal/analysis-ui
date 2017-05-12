import {createSelector} from 'reselect'

const POSITION = 10

function computeAccessibility (travelTimeSurface, isochroneCutoff, destinationGrid) {
  if (travelTimeSurface == null || destinationGrid == null) return null

  let accessibility = 0

  // y on outside, loop in order, hope the CPU figures this out and prefetches
  for (let y = 0; y < destinationGrid.height; y++) {
    const travelTimeY = y + destinationGrid.north - travelTimeSurface.north
    if (travelTimeY < 0 || travelTimeY >= travelTimeSurface.height) continue
    for (let x = 0; x < destinationGrid.width; x++) {
      const travelTimeX = x + destinationGrid.west - travelTimeSurface.west
      if (travelTimeX < 0 || travelTimeX >= travelTimeSurface.width) continue
      if (travelTimeSurface.get(travelTimeX, travelTimeY)[POSITION] < isochroneCutoff) {
        accessibility += destinationGrid.data[y * destinationGrid.width + x]
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
