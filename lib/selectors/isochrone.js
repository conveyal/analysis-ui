import jsolines from 'jsolines'
import {Map} from 'leaflet'
import {createSelector} from 'reselect'

const POSITION = 10

function computeIsochrone (travelTimeSurface, isochroneCutoff) {
  if (travelTimeSurface == null) return null
  const singleValuedSurface = new Uint8Array(travelTimeSurface.width * travelTimeSurface.height)

  // y on outside, loop in order, hope the CPU figures this out and prefetches
  for (let y = 0; y < travelTimeSurface.height; y++) {
    for (let x = 0; x < travelTimeSurface.width; x++) {
      singleValuedSurface[y * travelTimeSurface.width + x] = travelTimeSurface.get(x, y)[POSITION]
    }
  }

  return jsolines({
    surface: singleValuedSurface,
    width: travelTimeSurface.width,
    height: travelTimeSurface.height,
    cutoff: isochroneCutoff,
    project: ([x, y]) => {
      const {lat, lng} = Map.prototype.unproject([x + travelTimeSurface.west, y + travelTimeSurface.north], travelTimeSurface.zoom)
      return [lng, lat]
    }
  })
}

export const isochrone = createSelector(
  state => state.analysis.travelTimeSurface,
  state => state.analysis.isochroneCutoff,
  computeIsochrone
)

export const comparisonIsochrone = createSelector(
  state => state.analysis.comparisonTravelTimeSurface,
  state => state.analysis.isochroneCutoff,
  computeIsochrone
)
