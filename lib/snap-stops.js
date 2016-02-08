/**
 * Snap stops to route geometry
 * @author mattwigway
 */

 import split from './split'
 import distance from 'turf-distance'
 import point from 'turf-point'

/**
 * Snap stops to a geometry
 * @param geometry {Object} GeoJSON LineString geometry
 * @param stops {Object} GeoJSON feature collection of stops
 * @return array of [segment, fraction] for each stop
 */
export function snapStops (geometry, stops) {
  if (geometry.geometry === undefined) {
    geometry = {
      geometry,
      properties: {}
    }
  }

  // step 1: snap all stops to the nearest segment
  // create an array of [segment index, segment fraction]
  let snapped = stops.map(s => split(geometry, s))

  // TODO handle messy loop routes (code in GTFS Editor does a pretty decent job)
  return snapped
}

export function coordDistancesForGeometry (geometry) {
  // unwrap geojson
  if (geometry.geometry !== undefined) geometry = geometry.geometry

  let coordDistancesTraveled = [0]
  let total = 0
  for (let segment = 0; segment < geometry.coordinates.length - 1; segment++) {
    total += distance(point(geometry.coordinates[segment]), point(geometry.coordinates[segment + 1]))
    coordDistancesTraveled.push(total)
  }

  return coordDistancesTraveled
}
