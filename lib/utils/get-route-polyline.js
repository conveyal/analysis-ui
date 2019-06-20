import lonlat from '@conveyal/lonlat'
import {toGeoJSON} from '@mapbox/polyline'

import fetch from './fetch'

const MINIMUM_COORDINATE_DISTANCE = 1e-6
const MB_TOKEN = process.env.MAPBOX_ACCESS_TOKEN
const MB_BASE_URL = 'https://api.mapbox.com/directions/v5/mapbox/driving'
export const getMBUrl = o =>
  `${MB_BASE_URL}/${o.start};${o.end}.json?access_token=${MB_TOKEN}&alternatives=false&geometries=polyline`

/**
 * Get a route between two points from Mapbox. If the start and end coordinates
 * received are outside the maximum, append the original start and end points.
 *
 * @returns GeoJSON LineString
 */
export default function getRoutePolyline(start, end) {
  return fetch(
    getMBUrl({
      start: lonlat.toString(start),
      end: lonlat.toString(end)
    })
  )
    .then(r => r.json())
    .then(json => {
      const route = json.routes[0]
      const geojson = toGeoJSON(route.geometry)
      const c0 = geojson.coordinates[0]
      const cy = geojson.coordinates[geojson.coordinates.length - 1]
      if (!lonlat.isEqual(c0, start, MINIMUM_COORDINATE_DISTANCE)) {
        geojson.coordinates.unshift(lonlat.toCoordinates(start))
      }
      if (!lonlat.isEqual(cy, end, MINIMUM_COORDINATE_DISTANCE)) {
        geojson.coordinates.push(lonlat.toCoordinates(end))
      }

      return geojson
    })
}
