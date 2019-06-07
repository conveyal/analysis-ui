import lonlat from '@conveyal/lonlat'
import {decode as decodePolyline} from '@mapbox/polyline'

import fetch from './fetch'

const KEY = process.env.GRAPHHOPPER_API_KEY
const URL = 'https://graphhopper.com/api/1/route'

export default async function getRoutePolyline(start, end) {
  const startPoint = lonlat.toLatFirstString(start)
  const endPoint = lonlat.toLatFirstString(end)
  const req = `${URL}?key=${KEY}&point=${startPoint}&point=${endPoint}&instructions=false`
  const response = await fetch(req)
  const json = await response.json()

  return decodePolyline(json.paths[0].points).map(c => [c[1], c[0]]) // [lat,lon] -> [lon,lat]
}
