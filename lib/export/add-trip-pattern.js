/** convert an add trip pattern modification to r5 format */

import getStops from '../scenario-map/transit-editor/get-stops'
import getHopTimes from '../scenario-map/transit-editor/get-hop-times'

export default function convertAddTripPattern (mod) {
  let out = {}

  out.type = 'add-trips'
  out.bidirectional = mod.bidirectional
  let stops = getStops(mod)
  out.stops = stops.map((stop) => {
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

  out.frequencies = mod.timetables.map((tt) => {
    let dwellTimes = out.stops.map((stop) => tt.dwellTime)
    let hopTimes = getHopTimes(stops, tt.speed)
    let { monday, tuesday, wednesday, thursday, friday, saturday, sunday, startTime, endTime, headwaySecs } = tt
    return { monday, tuesday, wednesday, thursday, friday, saturday, sunday, hopTimes, dwellTimes, startTime, endTime, headwaySecs }
  })

  return out
}
