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

    for (let y = 0; y < travelTimeSurface.height; y++) {
      for (let x = 0; x < travelTimeSurface.width; x++) {
        const travelTime = travelTimeSurface.get(x, y)[percentileIndex]
        // - 1 because we want dataThisIteration[0] to be opportunities reached in 1 minute or less
        dataThisIteration[travelTime - 1] += destinationGrid.data[y * destinationGrid.width + x]
      }
    }

    // make cumulatvive
    for (let i = 0, val = 0; i < dataThisIteration.length; i++) {
      val += dataThisIteration[i]
      dataThisIteration[i] = val
    }

    spectrogramData.push(dataThisIteration)
  }

  return spectrogramData
}

export const spectrogramData = createSelector(
  state => state.analysis.spectrogramData,
  state => state.analysis.destinationGrid,
  computeSpectrogramData
)

export const comparisonSpectrogramData = createSelector(
  state => state.analysis.comparisonSpectrogramData,
  state => state.analysis.destinationGrid,
  computeSpectrogramData
)
