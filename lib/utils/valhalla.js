import fetch from 'isomorphic-fetch'
import {decode as decodePolyline} from '@mapbox/polyline'

const MAPZEN_TURN_BY_TURN_KEY = process.env.MAPZEN_TURN_BY_TURN_KEY

export async function route (start, end) {
  const json = {
    costing: 'bus',
    locations: [{lon: start.lon, lat: start.lat}, {lon: end.lon, lat: end.lat}]
  }
  const response = await fetch(
    `https://valhalla.mapzen.com/route?json=${JSON.stringify(json)}&api_key=${MAPZEN_TURN_BY_TURN_KEY}`
  )
  return response.json()
}

export async function polyline (start, end) {
  const json = await route(start, end)
  return decodePolyline(json.trip.legs[0].shape).map(c => [
    c[1] / 10,
    c[0] / 10
  ]) // Mapzen or Mapbox is encoding/decoding wrong?
}
