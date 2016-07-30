import distance from 'turf-distance'
import point from 'turf-point'

const CIRCUMFERENCE_OF_EARTH_METERS = 40000000

const toRadians = (degrees) => degrees * Math.PI / 180

export default function getStopNearPoint ({ // TODO just use a turf library — http://turfjs.org/docs/#nearest
  latlng,
  radiusMeters,
  radiusPixels = 10,
  stops,
  zoom
}) {
  const {lat, lng} = latlng

  // base snap distance on map zoom, make it five pixels
  if (radiusMeters === undefined) {
    const metersPerPixel = CIRCUMFERENCE_OF_EARTH_METERS / (256 * Math.pow(2, zoom))
    radiusMeters = radiusPixels * metersPerPixel
  }

  const dLat = 360 * radiusMeters / CIRCUMFERENCE_OF_EARTH_METERS
  const dLng = Math.abs(dLat / Math.cos(toRadians(lat)))

  const maxLat = lat + dLat
  const minLat = lat - dLat
  const maxLng = lng + dLng
  const minLng = lng - dLng

  const query = stops.filter((s) => s.stop_lat > minLat && s.stop_lat < maxLat && s.stop_lon > minLng && s.stop_lon < maxLng)
  const clickPoint = point([lng, lat])

  // filter using true distance
  const stopAtDistance = query
    .map((stop) => {
      return {
        distance: distance(clickPoint, point([stop.stop_lon, stop.stop_lat]), 'kilometers'),
        stop
      }
    })
    .filter((s) => s.distance < radiusMeters / 1000)

  // return closest
  let outStop = null
  let outDist = Infinity

  for (const { stop, distance } of stopAtDistance) {
    if (distance < outDist) {
      outStop = stop
      outDist = distance
    }
  }

  return outStop
}
