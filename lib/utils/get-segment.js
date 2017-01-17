import {isEqual as coordinatesAreEqual} from 'lonlng'
import lineString from 'turf-linestring'
import point from 'turf-point'

import {DEFAULT_STOP_SPACING_METERS} from '../constants'
import {polyline as getPolyline} from './valhalla'

export default async function getSegment ({
  followRoad,
  from,
  fromStopId,
  segments,
  spacing = DEFAULT_STOP_SPACING_METERS,
  stopAtEnd,
  stopAtStart,
  to,
  toStopId
}) {
  let geometry

  try {
    if (from && to) {
      if (followRoad) {
        const coordinates = await getPolyline({lng: from[0], lat: from[1]}, {lng: to[0], lat: to[1]})
        const c0 = coordinates[0]
        const cy = coordinates[coordinates.length - 1]
        const epsilon = 1e-6
        if (!coordinatesAreEqual(c0, from, epsilon)) {
          coordinates.unshift(from)
        }
        if (!coordinatesAreEqual(cy, to, epsilon)) {
          coordinates.push(to)
        }

        geometry = {
          type: 'LineString',
          coordinates
        }
      } else {
        geometry = await lineString([from, to]).geometry
      }
    } else {
      // start of geometry, from or to is undefined
      let coord = from || to
      geometry = await point(coord).geometry
    }
  } catch (e) {
    console.error(e.stack)
    throw e
  }

  return {
    geometry,
    stopAtStart,
    stopAtEnd,
    spacing,
    fromStopId,
    toStopId
  }
}
