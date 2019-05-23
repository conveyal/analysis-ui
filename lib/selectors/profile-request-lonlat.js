import pointInPolygon from '@turf/boolean-point-in-polygon'
import center from '@turf/center'
import {point, polygon} from '@turf/helpers'
import {getCoord} from '@turf/invariant'
import {createSelector} from 'reselect'

import selectAnalysisBounds from './analysis-bounds'
import selectProfileRequest from './profile-request'

export function boundsToPolygon(bounds) {
  return polygon([
    [
      [bounds.east, bounds.north],
      [bounds.east, bounds.south],
      [bounds.west, bounds.south],
      [bounds.west, bounds.north],
      [bounds.east, bounds.north]
    ]
  ])
}

export function geoJSONPointToLonLat(point) {
  const p = getCoord(point)
  return {
    lon: p[0],
    lat: p[1]
  }
}

export function getProfileRequestPoint(pr) {
  return point([pr.fromLon, pr.fromLat])
}

/**
 * Result goes directly to Leaflet.
 */
export default createSelector(
  selectAnalysisBounds,
  selectProfileRequest,
  (bounds, pr) => {
    const bbox = boundsToPolygon(bounds)
    const prPoint = getProfileRequestPoint(pr)
    if (pointInPolygon(prPoint, bbox)) {
      return geoJSONPointToLonLat(prPoint)
    }
    return geoJSONPointToLonLat(center(bbox))
  }
)
