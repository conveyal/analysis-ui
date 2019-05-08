//
/**
 * Convert an aggregation area represented as raster to an outline to display
 * on the map
 */

import lonlat from '@conveyal/lonlat'
import jsolines from 'jsolines'
import {createSelector} from 'reselect'

// cut off at cells that are 50% covered by the aggregation area. 30000 would be 30% etc
const CUTOFF = 50000

export function computeOutline(aggregationArea) {
  if (aggregationArea == null) return

  let {zoom, west, north, width, height, data} = aggregationArea

  // jsolines fills the cells around the edges of the area with Infinity to avoid edge effects.
  // Since the aggregation area mask goes all the way to the edge of the grid, make a slightly bigger
  // grid so we don't lose valuable data
  // TODO just fix jsolines
  width += 2
  height += 2

  const surface = new Int32Array(width * height)
  // fill with infinity (we reverse 0 and infinity below since Jsolines expects the contour line to
  // enclose an area of low values
  surface.fill(100000)

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const indexInSurface = y * width + x
      const indexInAggregationAreaGrid = (y - 1) * (width - 2) + (x - 1)
      // invert range  [0, 100000], jsolines expects to find polygons that enclose areas of low values
      // (originally intended for use with travel times)
      surface[indexInSurface] = 100000 - data[indexInAggregationAreaGrid]
    }
  }

  return jsolines({
    surface,
    width,
    height,
    cutoff: 100000 - CUTOFF, // invert cutoff so it is relative to original surface
    project: ([x, y]) => {
      // - 1 due to increasing the grid size above
      const ll = lonlat.fromPixel(
        {
          x: x + west - 1,
          y: y + north - 1
        },
        zoom
      )
      return [ll.lon, ll.lat]
    },
    // Temporarily disabling interpolation because it causes issues near edges (PR with fix made to
    // jsolines). Then again, maybe we want the blocky, un-interpolated style here to make it clear
    // that we've rasterized a vector geometry.
    interpolation: false
  })
}

export default createSelector(
  state => state.analysis.regional.aggregationArea,
  computeOutline
)
