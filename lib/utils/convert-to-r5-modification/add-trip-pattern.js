/** convert an add trip pattern modification to r5 format */

import getStops from '../get-stops'
import getHopTimes from '../get-hop-times'
import {getExactTimesFirstDepartures} from '../timetable'

export default function convertAddTripPattern ({
  bidirectional,
  segments,
  timetables
}) {
  const segmentStops = getStops(segments)
  const stops = segmentStops.map((stop) => {
    // already feed scoped
    if (stop.stopId != null) {
      return { id: stop.stopId }
    } else {
      return {
        lat: stop.lat,
        lon: stop.lon
      }
    }
  })

  const frequencies = timetables.map((tt) => {
    const {
      dwellTime,
      startTime,
      endTime,
      headwaySecs,
      exactTimes,
      segmentSpeeds,
      phaseAtStop,
      phaseFromStop,
      phaseFromTimetable,
      phaseSeconds,
      ...days
    } = tt
    const dwellTimes = stops.map((stop) => dwellTime)
    const hopTimes = getHopTimes(segmentStops, segmentSpeeds)
    if (exactTimes) {
      const firstDepartures = getExactTimesFirstDepartures(tt)
      return {
        ...days,
        hopTimes,
        dwellTimes,
        firstDepartures
      }
    } else {
      // include phasing information only if phaseAtStop is specified.
      // When clearing phasing, only the phaseAtStop is cleared.
      const phasing = phaseAtStop != null ? {
        phaseAtStop,
        phaseFromStop,
        phaseFromTimetable: phaseFromTimetable && phaseFromTimetable.length > 0
          ? phaseFromTimetable.split(':')[1]
          : phaseFromTimetable,
        phaseSeconds
      } : {}

      return {
        ...days,
        hopTimes,
        dwellTimes,
        startTime,
        endTime,
        headwaySecs,
        ...phasing
      }
    }
  })

  return {
    bidirectional,
    frequencies,
    stops,
    type: 'add-trips'
  }
}
