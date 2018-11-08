// @flow
import lonlat from '@conveyal/lonlat'
import message from '@conveyal/woonerf/message'
import {LatLng, LatLngBounds} from 'leaflet'

import type {Bounds} from '../types'

import reprojectCoordinates from './reproject-coordinates'

const ANTIMERIDIAN_WARNING = 'We do not currently support bounds that cross the antimeridian.'

export function toLatLngBounds (bounds: Bounds) {
  return new LatLngBounds([
    [bounds.north, bounds.west],
    [bounds.south, bounds.east]
  ])
}

/**
 * NB: We do not currently support crossing the antimeridian.
 */
export function fromLatLngBounds (bounds: LatLngBounds) {
  // Don't change the original bounds object
  let b = new LatLngBounds()
  b.extend(bounds)

  if (b.getWest() < -180) {
    b = new LatLngBounds(
      new LatLng(b.getSouth(), -180),
      b.getNorthEast()
    )

    window.alert(message('antimeridian', ANTIMERIDIAN_WARNING))
  }

  if (b.getEast() > 180) {
    b = new LatLngBounds(
      new LatLng(b.getSouth(), 180),
      b.getNorthEast()
    )
    window.alert(message('antimeridian', ANTIMERIDIAN_WARNING))
  }

  const bboxString = b.toBBoxString()
  return {
    north: b.getNorth(),
    south: b.getSouth(),
    east: b.getEast(),
    west: b.getWest(),
    toString: () => bboxString
  }
}

/**
 * Reproject bounds to the grid size that we use.
 */
export function reprojectBounds (bounds: LatLngBounds) {
  return new LatLngBounds(
    lonlat.toLeaflet(reprojectCoordinates(bounds.getSouthWest())),
    lonlat.toLeaflet(reprojectCoordinates(bounds.getNorthEast()))
  )
}
