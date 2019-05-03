import pointInPolygon from '@turf/boolean-point-in-polygon'
import center from '@turf/center'
import {point, polygon} from '@turf/helpers'
import {getCoord} from '@turf/invariant'
import {createSelector} from 'reselect'

import selectAnalysisBounds from './analysis-bounds'
import selectProfileRequest from './profile-request'

/**
 * Result goes directly to Leaflet.
 */
export default createSelector(
  selectAnalysisBounds,
  selectProfileRequest,
  (bounds, pr) => {
    const bbox = polygon([
      [
        [bounds.east, bounds.north],
        [bounds.east, bounds.south],
        [bounds.west, bounds.south],
        [bounds.west, bounds.north],
        [bounds.east, bounds.north]
      ]
    ])
    if (pr.fromLon && pr.fromLat) {
      if (pointInPolygon(point([pr.fromLon, pr.fromLat]), bbox)) {
        return {
          lat: pr.fromLat,
          lng: pr.fromLon
        }
      }
    }
    const centerPoint = getCoord(center(bbox))
    return {
      lat: centerPoint[1],
      lng: centerPoint[0]
    }
  }
)
