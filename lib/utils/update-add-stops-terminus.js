import dbg from 'debug'

const debug = dbg('analysis-ui:update-add-stops-terminus')

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

  if (fromStop == null) {
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
  } else if (toStop == null) {
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
  } else {
    modification.segments = [
      {
        geometry: {
          type: 'LineString',
          coordinates: [
            [fromStop.stop_lon, fromStop.stop_lat],
            [toStop.stop_lon, toStop.stop_lat]
          ]
        },
        stopAtStart: true,
        stopAtEnd: true,
        fromStopId: `${modification.feed}:${fromStop.stop_id}`,
        toStopId: `${modification.feed}:${toStop.stop_id}`,
        spacing: 0
      }
    ]
  }

  modification.fromStop = fromStop != null ? fromStop.stop_id : null
  modification.toStop = toStop != null ? toStop.stop_id : null

  return modification
}
