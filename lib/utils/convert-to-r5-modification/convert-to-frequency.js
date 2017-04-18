/** export a convert-to-frequency modification to r5 */
import {getExactTimesFirstDepartures} from '../timetable'

export default function convertConvertToFrequency (mod) {
  const out = {}
  out.type = 'adjust-frequency'

  out.route = `${mod.feed}:${mod.routes[0]}`

  out.retainTripsOutsideFrequencyEntries = mod.retainTripsOutsideFrequencyEntries

  out.entries = mod.entries.map(({
    sourceTrip,
    startTime,
    endTime,
    headwaySecs,
    exactTimes,
    phaseAtStop,
    phaseFromStop,
    phaseFromTimetable,
    phaseSeconds,
    ...days
  }) => {
    // if exactTimes is true, generate scheduled trips
    if (exactTimes) {
      return {
        firstDepartures: getExactTimesFirstDepartures({headwaySecs, startTime, endTime}),
        sourceTrip: `${mod.feed}:${sourceTrip}`,
        ...days
      }
    } else {
      return {
        headwaySecs,
        startTime,
        endTime,
        sourceTrip: `${mod.feed}:${sourceTrip}`,
        phaseAtStop,
        phaseFromStop,
        phaseFromTimetable,
        phaseSeconds,
        ...days
      }
    }
  })

  return out
}
