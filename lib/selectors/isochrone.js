import jsolines from 'jsolines'
import {Map as LeafletMap} from 'leaflet'
import {createSelector} from 'reselect'

import {TRAVEL_TIME_PERCENTILES} from '../constants/analysis'

const POSITION = TRAVEL_TIME_PERCENTILES.indexOf(50)

// singleValuedSurface, width, height all come from selector defined below and thus must
// be passed in one argument
export function computeIsochrone (singleValuedSurface, isochroneCutoff) {
  if (singleValuedSurface == null) return null

  const {surface, width, height, west, north, zoom} = singleValuedSurface

  return jsolines({
    surface,
    width,
    height,
    cutoff: isochroneCutoff,
    project: ([x, y]) => {
      const {lat, lng} = LeafletMap.prototype.unproject(
        [x + west, y + north],
        zoom
      )
      return [lng, lat]
    }
  })
}

/**
 * The travel time surface contains percentiles, compute a surface with a single percentile for jsolines
 * done separately from isochrone computation because it can be saved when the isochrone cutoff changes
 * when put in a separate selector, memoization will handle this for us.
 */
export function computeSingleValuedSurface (travelTimeSurface) {
  if (travelTimeSurface == null) return null
  const singleValuedSurface = new Uint8Array(
    travelTimeSurface.width * travelTimeSurface.height
  )

  // y on outside, loop in order, hope the CPU figures this out and prefetches
  for (let y = 0; y < travelTimeSurface.height; y++) {
    for (let x = 0; x < travelTimeSurface.width; x++) {
      singleValuedSurface[
        y * travelTimeSurface.width + x
      ] = travelTimeSurface.get(x, y)[POSITION]
    }
  }

  return {
    surface: singleValuedSurface,
    width: travelTimeSurface.width,
    height: travelTimeSurface.height,
    north: travelTimeSurface.north,
    west: travelTimeSurface.west,
    zoom: travelTimeSurface.zoom
  }
}

const singleValuedSurface = createSelector(
  state => state.analysis.travelTimeSurface,
  computeSingleValuedSurface
)

const isochrone = createSelector(
  singleValuedSurface,
  state => state.analysis.isochroneCutoff,
  computeIsochrone
)

export default isochrone
