/** convert an add trip pattern modification to r5 format */

export default function convertAddTripPattern (mod) {
  let out = {}

  out.type = 'add-trips'
  out.bidirectional = mod.bidirectional
  out.stops = []

  for (let i = 0; i < mod.stops.length; i++) {
    if (!mod.stops[i]) continue

    if (mod.stopIds[i] != null) {
      // existing stops, already feed scoped
      out.stops.push({ stopId: mod.stopIds[i] })
    } else {
      // new stops
      let [ lon, lat ] = mod.geometry.coordinates[i]
      out.stops.push({ lon, lat })
    }
  }

  out.frequencies = mod.timetables.map((tt) => convertTimetable(tt))

  return out
}

function convertTimetable (tt) {
  // subset timetable to just r5 properties
  let { monday, tuesday, wednesday, thursday, friday, saturday, sunday, hopTimes, dwellTimes, startTime, endTime, headwaySecs } = tt
  return { monday, tuesday, wednesday, thursday, friday, saturday, sunday, hopTimes, dwellTimes, startTime, endTime, headwaySecs }
}
