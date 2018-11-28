// @flow
import filter from 'lodash/filter'

import type {GTFSStop, Segment} from '../types'

/**
 * Create a point as a psuedo-segment for reroute modifications from stop info.
 */
export const stopToPoint = (coordinates: [number, number], id: string) => ({
  geometry: {
    type: 'Point',
    coordinates
  },
  stopAtStart: true,
  stopAtEnd: true,
  fromStopId: id,
  toStopId: id,
  spacing: 0
})

/**
 * Remove point segments.
 */
const filterPointSegments = (segments: Segment[]) =>
  filter(segments, s => s.geometry.type !== 'Point')

/**
 * Reroute from a stop.
 */
export function segmentsFromStop (
  fromStop: GTFSStop,
  segments: Segment[],
  newStopId: string
) {
  if (segments.length === 0) {
    return [stopToPoint([fromStop.stop_lon, fromStop.stop_lat], newStopId)]
  }

  const nextSegment = segments[0]
  const nsg = nextSegment.geometry
  const nextCoordinates = nsg.type === 'Point'
    ? nsg.coordinates
    : nsg.coordinates[0]

  const newSegment = {
    fromStopId: newStopId,
    geometry: {
      type: 'LineString',
      coordinates: [[fromStop.stop_lon, fromStop.stop_lat], nextCoordinates]
    },
    spacing: 0,
    stopAtEnd: nextSegment.stopAtStart,
    stopAtStart: true,
    toStopId: nextSegment.fromStopId
  }

  return [newSegment, ...filterPointSegments(segments)]
}

/**
 * Reroute to a stop
 */
export function segmentsToStop (
  toStop: GTFSStop,
  segments: Segment[],
  newStopId: string
) {
  if (segments.length === 0) {
    return [stopToPoint([toStop.stop_lon, toStop.stop_lat], newStopId)]
  }

  const previousSegment = segments[segments.length - 1]
  const psg = previousSegment.geometry
  const previousCoordinates = psg.type === 'Point'
    ? psg.coordinates
    : psg.coordinates.slice(-1)[0]

  const newSegment = {
    fromStopId: previousSegment.toStopId,
    geometry: {
      type: 'LineString',
      coordinates: [previousCoordinates, [toStop.stop_lon, toStop.stop_lat]]
    },
    spacing: 0,
    stopAtEnd: true,
    stopAtStart: previousSegment.stopAtEnd,
    toStopId: newStopId
  }

  return [...filterPointSegments(segments), newSegment]
}
