/** given an array of stops from getStops and a speed in kilometers per hour, compute hop times */

export default function getHopTimes (stops, speed) {
  let hopTimes = []

  for (let i = 1; i < stops.length; i++) {
    let hopDistMeters = stops[i].distanceFromStart - stops[i - 1].distanceFromStart
    let hopTimeSeconds = hopDistMeters / (speed * 1000) * 3600

    // use math.round to avoid accumulating error, the expectation will be 0 as half are rounded up and half down
    hopTimes.push(Math.round(hopTimeSeconds))
  }

  return hopTimes
}
