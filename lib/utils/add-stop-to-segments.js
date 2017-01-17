import getSegment from './get-segment'

export async function atStart ({
  coordinates,
  followRoad,
  isStop,
  segments,
  spacing,
  stopId
}) {
  // insert at start
  let to, stopAtEnd, toStopId

  // handle case of no existing stops
  if (segments.length > 0) {
    to = segments[0].geometry.type === 'LineString' ? segments[0].geometry.coordinates[0] : segments[0].geometry.coordinates
    // if segments[0] is a point, the from and to stop information are identical (see below) so we don't have to worry about
    // detecting that case here.
    stopAtEnd = segments[0].stopAtStart
    toStopId = segments[0].fromStopId
  } else {
    to = null // leave null so a point is created
    // duplicate all the information so it will be picked up when the next stop is created
    stopAtEnd = isStop
    toStopId = stopId
  }

  const newSegment = await getSegment({
    followRoad,
    from: coordinates,
    fromStopId: stopId,
    // can also be a point if only one stop has been created
    segments,
    spacing,
    stopAtEnd,
    stopAtStart: isStop,
    to,
    toStopId
  })

  segments.unshift(newSegment)
  // if there was a segment that was just a point, get rid of it
  if (segments.length === 2 && segments[1].geometry.type === 'Point') segments.pop()

  return segments
}

export async function inMiddle ({
  coordinates,
  followRoad,
  index,
  isStop,
  segments,
  stopId
}) {
  // replacing one segment with two in the middle
  const sourceSegment = segments[index]
  const [segment0, segment1] = await Promise
    .all([
      getSegment({
        followRoad,
        from: sourceSegment.geometry.coordinates[0],
        fromStopId: sourceSegment.fromStopId,
        segments,
        spacing: sourceSegment.spacing,
        stopAtEnd: isStop,
        stopAtStart: sourceSegment.stopAtStart,
        to: coordinates,
        toStopId: stopId
      }),
      getSegment({
        followRoad,
        from: coordinates,
        fromStopId: stopId,
        segments,
        spacing: sourceSegment.spacing,
        stopAtEnd: sourceSegment.stopAtEnd,
        stopAtStart: isStop,
        to: sourceSegment.geometry.coordinates.slice(-1)[0],
        toStopId: sourceSegment.toStopId
      })
    ])

  // swap out the segments
  segments.splice(index, 1, segment0, segment1)

  return segments
}

export async function atEnd ({
  coordinates,
  followRoad,
  isStop,
  segments,
  spacing,
  stopId
}) {
  // insert at end
  let from, stopAtStart, fromStopId

  const lastSegIdx = segments.length - 1

  // handle creating the first stop. Note that we only support this when adding at the end.
  if (segments.length > 0) {
    from = segments[lastSegIdx].geometry.type === 'LineString' ? segments[lastSegIdx].geometry.coordinates.slice(-1)[0] : segments[lastSegIdx].geometry.coordinates
    stopAtStart = segments[lastSegIdx].stopAtEnd
    fromStopId = segments[lastSegIdx].toStopId
  } else {
    from = null
    stopAtStart = isStop
    fromStopId = stopId
  }

  const newSegment = await getSegment({
    followRoad,
    from,
    fromStopId,
    // can also be a point if only one stop has been created
    segments,
    spacing,
    stopAtEnd: isStop,
    stopAtStart,
    to: coordinates,
    toStopId: stopId
  })

  segments.push(newSegment)

  // if there was a segment that was just a point, get rid of it
  if (segments.length === 2 && segments[0].geometry.type === 'Point') segments.shift()

  return segments
}
