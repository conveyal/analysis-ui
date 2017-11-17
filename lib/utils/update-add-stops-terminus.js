import dbg from 'debug'

const debug = dbg('scenario-editor:update-add-stops-terminus')

/**
 * Returns a new modification, with the stop ID updated. which is either
 * fromStop or toStop. newStop is the stop obj to set it to
 */
export default function updateAddStopsTerminus ({
  feed,
  modification,
  newStop,
  which
}) {
  modification = Object.assign({}, modification)

  const fromStop = which === 'fromStop'
    ? newStop
    : feed.stopsById[modification.fromStop]
  const toStop = which === 'toStop'
    ? newStop
    : feed.stopsById[modification.toStop]

  debug(`fromStop: ${fromStop}, toStop: ${toStop}`)

  if (modification.segments.length === 0) {
    if (which === 'toStop') {
      modification.segments = [
        {
          geometry: {
            type: 'Point',
            coordinates: [toStop.stop_lon, toStop.stop_lat]
          },
          stopAtStart: true,
          stopAtEnd: true,
          fromStopId: `${modification.feed}:${toStop.stop_id}`,
          toStopId: `${modification.feed}:${toStop.stop_id}`,
          spacing: 0
        }
      ]
    } else {
      modification.segments = [
        {
          geometry: {
            type: 'Point',
            coordinates: [fromStop.stop_lon, fromStop.stop_lat]
          },
          stopAtStart: true,
          stopAtEnd: true,
          fromStopId: `${modification.feed}:${fromStop.stop_id}`,
          toStopId: `${modification.feed}:${fromStop.stop_id}`,
          spacing: 0
        }
      ]
    }
  } else { // there is already at least one segment entry in the reroute
    const coordinates = [newStop.stop_lon, newStop.stop_lat]
    // TODO use the async functions in addStopToSegments?

    const newSegment = {
      fromStopId: null,
      geometry: {
        type: 'LineString',
        coordinates: []
      },
      spacing: 0,
      stopAtEnd: true,
      stopAtStart: true,
      toStopId: null
    }

    if (which === 'toStop') {
      // the new toStop will be added after a segment that precedes it
      const precSeg = modification.segments[modification.segments.length - 1]
      newSegment.geometry.type = 'LineString'
      if (precSeg.geometry.type === 'Point') {
        newSegment.geometry.coordinates.push(precSeg.geometry.coordinates)
        modification.segments.pop()
      } else {
        newSegment.geometry.coordinates.push(
          precSeg.geometry.coordinates.slice(-1)[0]
        )
      }
      newSegment.geometry.coordinates.push(coordinates)
      newSegment.fromStopId = precSeg.toStopId
      newSegment.stopAtStart = precSeg.stopAtEnd
      newSegment.toStopId = `${modification.feed}:${toStop.stop_id}`
      modification.segments.push(newSegment)
    } else {
      // the new fromStop will be added before a segment that succeeds it
      const succSeg = modification.segments[0]
      newSegment.geometry.type = 'LineString'
      if (succSeg.geometry.type === 'Point') {
        newSegment.geometry.coordinates.push(succSeg.geometry.coordinates)
        modification.segments.pop()
      } else {
        newSegment.geometry.coordinates.push(succSeg.geometry.coordinates[0])
      }
      newSegment.geometry.coordinates.unshift(coordinates)
      newSegment.toStopId = succSeg.fromStopId
      newSegment.stopAtEnd = succSeg.stopAtStart
      newSegment.fromStopId = `${modification.feed}:${fromStop.stop_id}`
      modification.segments.unshift(newSegment)
    }
  }

  modification.fromStop = fromStop != null ? fromStop.stop_id : null
  modification.toStop = toStop != null ? toStop.stop_id : null

  return modification
}
