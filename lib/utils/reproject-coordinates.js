// @flow
import {LatLng, Map} from 'leaflet'

import {PROJECTION_ZOOM_LEVEL} from '../constants'

/**
 * Snap a geographic coordinate to the nearest grid point by projecting and
 * rounding the {x, y} values and unprojecting them back to coordinates.
 */
export default function reproject (ll: LatLng) {
  const {x, y} = Map.prototype.project(ll, PROJECTION_ZOOM_LEVEL)
  return Map.prototype.unproject([
    Math.floor(x),
    Math.floor(y)
  ], PROJECTION_ZOOM_LEVEL)
}
