// @flow
import turf from '@turf/helpers'
import nearestPointOnLine from '@turf/nearest-point-on-line'
import pointToLineDistance from '@turf/point-to-line-distance'
import clustersDbscan from '@turf/clusters-dbscan'
import lineDistance from '@turf/line-distance'

import type {GTFSStop, Segment} from '../types'

// TODO use async function that allows following streets
// import getLineString from './get-line-string'
const createLineString = (from, to) => {
  return {type: 'LineString', coordinates: [from, to]}
}

const STOP_SEARCH_BUFFER_KM = 0.02 // 20 meters on either side of the alignment
const APPROX_MIN_SPACING_KM = 0.08 // 80 meters

export default function getExistingStopsAlongPattern (segments: Segment[], stops: GTFSStop[]): Segment [] | void {
  const newSegments = []
  segments.forEach(segment => {
    const line = turf.lineString(segment.geometry.coordinates)
    const segmentLengthKm = lineDistance(line)
    const candidateStops = []
    // iterate through stops, calculating distance from nearby stops to segment
    stops.forEach(stop => {
      // Ignore the source segment's start and end stops
      if (stop.stop_id !== segment.fromStopId && stop.stop_id !== segment.toStopId) {
        const stopPoint = turf.point([stop.stop_lon, stop.stop_lat])
        if (pointToLineDistance(stopPoint, line) <= STOP_SEARCH_BUFFER_KM) {
          const pointOnLine = nearestPointOnLine(line, stopPoint)
          // Ignore points too close to start or end stops
          if ((!segment.stopAtStart ||
            pointOnLine.properties.location > APPROX_MIN_SPACING_KM) &&
            (!segment.stopAtEnd ||
            segmentLengthKm - pointOnLine.properties.location > APPROX_MIN_SPACING_KM)
          ) {
            pointOnLine.properties.stopId = stop.stop_id
            pointOnLine.properties.stopCoords = [stop.stop_lon, stop.stop_lat]
            candidateStops.push(pointOnLine)
          }
        }
      }
    })
    // cluster stops that are close to each other
    const clusteredStops = clustersDbscan(turf.featureCollection(candidateStops), APPROX_MIN_SPACING_KM, {minPoints: 1})

    // in each cluster, find the stop that is closest to the segment
    const closestStopPerCluster = []
    clusteredStops.features.forEach(stop => {
      const cluster = stop.properties.cluster
      if (!closestStopPerCluster[cluster] ||
          stop.properties.dist < closestStopPerCluster[cluster].properties.distance) {
        closestStopPerCluster[cluster] = stop
      }
    })

    // modify the segment if there are stops to add

    if (closestStopPerCluster.length > 0) {
      closestStopPerCluster.sort((a, b) => a.properties.location - b.properties.location)
      const last = closestStopPerCluster.length - 1
      // first sub-segment to add
      newSegments.push({
        fromStopId: segment.fromStopId,
        geometry: createLineString(segment.geometry.coordinates[0],
          closestStopPerCluster[0].properties.stopCoords),
        spacing: segment.spacing,
        stopAtEnd: true,
        stopAtStart: segment.stopAtStart,
        toStopId: closestStopPerCluster[0].properties.stopId
      })
      // intermediate sub-segments
      for (let i = 0; i < last; i++) {
        const fromStopProps = closestStopPerCluster[i].properties
        const toStopProps = closestStopPerCluster[i + 1].properties
        newSegments.push({
          fromStopId: fromStopProps.stopId,
          geometry: createLineString(fromStopProps.stopCoords,
            toStopProps.stopCoords),
          spacing: segment.spacing,
          stopAtEnd: true,
          stopAtStart: true,
          toStopId: toStopProps.stopId
        })
      }
      // last sub-segment
      newSegments.push({
        fromStopId: closestStopPerCluster[last].properties.stopId,
        geometry: createLineString(
          closestStopPerCluster[last].properties.stopCoords,
          segment.geometry.coordinates[segment.geometry.coordinates.length - 1]
        ),
        spacing: segment.spacing,
        stopAtEnd: segment.stopAtEnd,
        stopAtStart: true,
        toStopId: segment.toStopId
      })
    } else {
      newSegments.push(segment)
    }
  })
  return newSegments
}
