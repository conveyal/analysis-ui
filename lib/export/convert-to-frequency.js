/** export a convert-to-frequency modification to r5 */

export default function convertConvertToFrequency (mod) {
  let out = {}
  out.type = 'adjust-frequency'

  out.route = `${mod.feed}:${mod.routes[0]}`

  out.entries = mod.entries.map((entry) => {
    let out = Object.assign({}, entry, { sourceTrip: `${mod.feed}:${entry.sourceTrip}` })
    delete out.patternTrips // not needed
    return out
  })

  return out
}
