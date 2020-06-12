import lonlat from '@conveyal/lonlat'
import pointInPolygon from '@turf/boolean-point-in-polygon'
import center from '@turf/center'
import {point, polygon} from '@turf/helpers'
import {getCoord} from '@turf/invariant'
import get from 'lodash/get'
import {createSelector} from 'reselect'

import selectAnalysisBounds from './analysis-bounds'
import selectCurrentRegion from './current-region'

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

const selectLonLat = createSelector(
  (s) => get(s, 'analysis.requestsSettings[0]'),
  ({fromLon, fromLat}) => {
    try {
      return lonlat({lon: fromLon, lat: fromLat})
    } catch (e) {
      return null
    }
  }
)

/**
 * Result goes directly to Leaflet.
 */
export default createSelector(
  selectAnalysisBounds,
  selectCurrentRegion,
  selectLonLat,
  (bounds, region, lonlat) => {
    const bbox = boundsToPolygon(bounds || region.bounds)
    if (lonlat) {
      if (pointInPolygon(point([lonlat.lon, lonlat.lat]), bbox)) {
        return lonlat
      }
    }
    return geoJSONPointToLonLat(center(bbox))
  }
)
