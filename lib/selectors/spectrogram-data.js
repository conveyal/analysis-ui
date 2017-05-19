import {createSelector} from 'reselect'

const MAX_TRIP_DURATION = 120

/** spectrogram data is just an array of cumulative accessibility curves for different percentiles. */
function computeSpectrogramData (travelTimeSurface, destinationGrid) {
  if (travelTimeSurface == null || destinationGrid == null) return null

  const spectrogramData = []

  // percentileIndex may not be the same as the percentile as there may not be 100 percentiles in the data
  for (let percentileIndex = 0; percentileIndex < travelTimeSurface.nSamples; percentileIndex++) {
    const dataThisIteration = []
    for (let i = 0; i < MAX_TRIP_DURATION; i++) dataThisIteration.push(0)

    for (let y = 0; y < destinationGrid.height; y++) {
      const travelTimeY = y + destinationGrid.north - travelTimeSurface.north
      if (travelTimeY < 0 || travelTimeY >= travelTimeSurface.height) continue
      for (let x = 0; x < destinationGrid.width; x++) {
        const travelTimeX = x + destinationGrid.west - travelTimeSurface.west
        if (travelTimeX < 0 || travelTimeX >= travelTimeSurface.width) continue
        const travelTime = travelTimeSurface.get(travelTimeX, travelTimeY)[percentileIndex]
        if (travelTime >= MAX_TRIP_DURATION) continue
        // dataThisIteration[i] is the marginal accessibility from minute i to minute i + 1.
        // travel times are floored from seconds to minutes on the server so just using the floored
        // value as an index directly is correct.
        dataThisIteration[travelTime] += destinationGrid.data[y * destinationGrid.width + x]
      }
    }

    // make non-cumulative
    for (let i = 1; i < dataThisIteration.length; i++) {
      dataThisIteration[i] += dataThisIteration[i - 1]
    }

    spectrogramData.push(dataThisIteration)
  }

  return spectrogramData
}

export const spectrogramData = createSelector(
  state => state.analysis.travelTimeSurface,
  state => state.analysis.destinationGrid,
  computeSpectrogramData
)

export const comparisonSpectrogramData = createSelector(
  state => state.analysis.comparisonTravelTimeSurface,
  state => state.analysis.destinationGrid,
  computeSpectrogramData
)
