/** flow stops along a route */

import distance from 'turf-distance'
import point from 'turf-point'

export default function getStops (modification) {
  let { segments } = modification
  if (segments.length === 0 || segments.length === 1 && segments[0].geometry.type === 'Point') {
    return []
  }

  let ret = []

  ret.push({
    stopId: segments[0].fromStopId,
    index: 0,
    lat: segments[0].geometry.coordinates[0][1],
    lon: segments[0].geometry.coordinates[0][0],
    autoCreated: !segments[0].stopAtStart,
    distanceFromStart: 0
  })

  // loop over the route, making stops as we go
  let distanceToLastStop = 0
  let distanceToLineSegmentStart = 0

  for (let segIdx = 0; segIdx < segments.length; segIdx++) {
    let segment = segments[segIdx]
    // now loop over line segments within this segment, accumulating distance as we go
    // a single transit segment can have multiple line segments, because we've used a street router between endpoints
    for (let i = 1; i < segment.geometry.coordinates.length; i++) {
      let c0 = segment.geometry.coordinates[i - 1]
      let c1 = segment.geometry.coordinates[i]
      let distanceThisLineSegment = distance(point(c0), point(c1), 'kilometers') * 1000

      // segment.spacing = 0 means no automatic stop creation in this segment
      while (segment.spacing > 0 && distanceToLastStop + segment.spacing < distanceToLineSegmentStart + distanceThisLineSegment) {
        // how far into the segment do we place the stop
        let frac = (distanceToLastStop + segment.spacing - distanceToLineSegmentStart) / distanceThisLineSegment
        if (frac < 0) frac = 0 // most likely the last segment did not have automatic stop creation

        let pos = [c0[0] + (c1[0] - c0[0]) * frac, c0[1] + (c1[1] - c0[1]) * frac]

        // can't just add segment.spacing because of converting negative fractions to zero above
        // this can happen when the last segment did not have automatic stop creation, or had a larger spacing
        // TODO in the latter case, we probably want to continue to apply the spacing from the last line segment until we create a new stop?
        distanceToLastStop = distanceToLineSegmentStart + frac * distanceThisLineSegment

        ret.push({
          stopId: null,
          index: segIdx,
          lat: pos[1],
          lon: pos[0],
          autoCreated: true,
          distanceFromStart: distanceToLastStop
        })
      }

      distanceToLineSegmentStart += distanceThisLineSegment
    }

    if (segment.stopAtEnd) {
      let endCoord = segment.geometry.coordinates.slice(-1)[0]
      ret.push({
        stopId: segment.toStopId,
        index: segIdx + 1,
        lat: endCoord[1],
        lon: endCoord[0],
        autoCreated: false,
        distanceFromStart: distanceToLineSegmentStart
      })

      // restart the spacing
      distanceToLastStop = distanceToLineSegmentStart // distanceToLineSegmentStart already set to the start of the next line segment
    }
  }

  return ret
}
