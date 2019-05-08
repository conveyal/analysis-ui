//
import lonlat from '@conveyal/lonlat'

/**
 * Create a straight-line-distance travel time surface. This is a hidden feature
 * to allow a particular client to demonstrate that straight-line distance _from
 * the origin_ is absurd when used to compute transit access. Yes, people
 * actually do this.
 */
export default function createStraightLineSurface(surface, origin, speedKmh) {
  return {
    ...surface,
    errors: [],
    warnings: [
      {
        title: `Using straight line distance with speed ${speedKmh} km/h`,
        messages: []
      }
    ],
    get(x, y) {
      const ll = lonlat.fromPixel(
        {
          x: x + surface.west,
          y: y + surface.north
        },
        surface.zoom
      )
      const distMeters = lonlat
        .toLeaflet(ll)
        .distanceTo(lonlat.toLeaflet(origin))

      const timeMinutes = ((distMeters / 1000 / speedKmh) * 60) | 0

      return Array(surface.depth).fill(timeMinutes)
    }
  }
}
