/** export a convert-to-frequency modification to r5 */

export default function convertConvertToFrequency (mod) {
  let out = {}
  out.type = 'adjust-frequency'

  out.route = `${mod.feed}:${mod.routes[0]}`

  out.retainTripsOutsideFrequencyEntries = mod.retainTripsOutsideFrequencyEntries

  out.entries = mod.entries.map((entry) => {
    let outEntry = Object.assign({}, entry, { sourceTrip: `${mod.feed}:${entry.sourceTrip}` })
    delete outEntry.patternTrips // not needed
    return outEntry
  })

  return out
}
