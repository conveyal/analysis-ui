// @flow
import Leaflet from 'leaflet'

import {fromLatLngBounds, toLatLngBounds, reprojectBounds} from '../bounds'

describe('utils > bounds', () => {
  it('should convert from and to bounds correctly', () => {
    const bounds = {
      north: 39.1,
      south: 38.1,
      east: -70.1,
      west: -70.9
    }
    const leafletBounds = toLatLngBounds(bounds)
    const newBounds = fromLatLngBounds(leafletBounds)
    const reprojectedBounds = reprojectBounds(leafletBounds)

    expect(newBounds.north).toBe(bounds.north)
    expect(newBounds.south).toBe(bounds.south)
    expect(newBounds.east).toBe(bounds.east)
    expect(newBounds.west).toBe(bounds.west)
    expect(reprojectedBounds).toBeInstanceOf(Leaflet.LatLngBounds)
  })
})
