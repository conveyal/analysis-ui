// @flow
import lonlat from '@conveyal/lonlat'

import {PROJECTION_ZOOM_LEVEL as Z} from '../constants'

/**
 * Snap a geographic coordinate to the nearest grid point by projecting and
 * rounding the {x, y} values and unprojecting them back to coordinates.
 */
export default function reproject (ll) {
  const p = lonlat.toPixel(ll, Z)
  return lonlat.fromPixel({
    x: Math.round(p.x),
    y: Math.round(p.y)
  }, Z)
}
