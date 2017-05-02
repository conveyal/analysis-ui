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
    id,
    monday,
    tuesday,
    wednesday,
    thursday,
    friday,
    saturday,
    sunday
  }) => {
    const days = {
      monday,
      tuesday,
      wednesday,
      thursday,
      friday,
      saturday,
      sunday
    }

    // if exactTimes is true, generate scheduled trips
    if (exactTimes) {
      return {
        firstDepartures: getExactTimesFirstDepartures({headwaySecs, startTime, endTime}),
        sourceTrip: `${mod.feed}:${sourceTrip}`,
        ...days
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
        headwaySecs,
        startTime,
        endTime,
        sourceTrip: `${mod.feed}:${sourceTrip}`,
        entryId: id,
        ...phasing,
        ...days
      }
    }
  })

  return out
}
