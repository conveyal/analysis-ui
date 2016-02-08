/** Split: find the closest point on a line segment to a given point */

import bearing from 'turf-bearing'
import point from 'turf-point'
import destination from 'turf-destination'
import distance from 'turf-distance'

export default function split (line, atPoint) {
  let bestDistance = Infinity
  let bestSegment
  let bestFraction

  for (let segment = 0; segment < line.geometry.coordinates.length - 1; segment++) {
    let segBearing = bearing(point(line.geometry.coordinates[segment]), point(line.geometry.coordinates[segment + 1]))
    let perpendicular = segBearing + 90 // - 90 would work as well
    let destPoint = destination(atPoint, 0.001, perpendicular, 'kilometers')

    // figure where they intersect. Note that this is the intersection of the lines, not the line segments,
    // and thus will always find an intersection (unless the lines are parallel, which they cannot be due to the rotation above)
    // Note also that we're using Euclidean math on lat/lng pairs, which is generally frowned upon but is fine here because the
    // scaling transform is affine (we are effectively scaling the map differently in two dimensions; it's safe to ignore the)
    // fact that the scales are not constant across the map, because the variation in scale is small).
    let intersection = findIntersection({
      x1: atPoint.geometry.coordinates[0],
      y1: atPoint.geometry.coordinates[1],
      x2: destPoint.geometry.coordinates[0],
      y2: destPoint.geometry.coordinates[1],
      x3: line.geometry.coordinates[segment][0],
      y3: line.geometry.coordinates[segment][1],
      x4: line.geometry.coordinates[segment + 1][0],
      y4: line.geometry.coordinates[segment + 1][1]
    })

    // figure out the fraction from that point
    let frac

    // we can just figure everything out from the x coordinates, unless the line is vertical, in which case we use the y coordinates
    let start, end, intersect

    if (Math.abs(line.geometry.coordinates[segment][0] - line.geometry.coordinates[segment + 1][0]) > 1e-8) {
      start = line.geometry.coordinates[segment][0]
      end = line.geometry.coordinates[segment + 1][0]
      intersect = intersection.x
    } else {
      // N/S line
      start = line.geometry.coordinates[segment][1]
      end = line.geometry.coordinates[segment + 1][1]
      intersect = intersection.y
    }

    // we don't care if end > start, signs will cancel
    frac = (intersect - start) / (end - start)

    if (frac > 1) frac = 1
    if (frac < 0) frac = 0

    // phew. we have a fraction along this segment
    // make a point
    let dX = line.geometry.coordinates[segment + 1][0] - line.geometry.coordinates[segment][0]
    let dY = line.geometry.coordinates[segment + 1][1] - line.geometry.coordinates[segment][1]

    let snapped = point([line.geometry.coordinates[segment][0] + frac * dX, line.geometry.coordinates[segment][1] + frac * dY])
    let dist = distance(atPoint, snapped, 'kilometers')

    if (dist < bestDistance) {
      bestDistance = dist
      bestSegment = segment
      bestFraction = frac
    }
  }

  return [bestSegment, bestFraction]
}

// https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection
function findIntersection ({ x1, y1, x2, y2, x3, y3, x4, y4 }) {
  let xNumerator = (x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)
  let yNumerator = (x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)
  let denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4)

  return {
    x: xNumerator / denominator,
    y: yNumerator / denominator
  }
}
