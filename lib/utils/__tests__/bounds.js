import Leaflet from 'lib/leaflet'

import {mockRegion} from '../mock-data'
import {fromLatLngBounds, toLatLngBounds, reprojectBounds} from '../bounds'

test('utils > bounds', () => {
  const {bounds} = mockRegion
  const leafletBounds = toLatLngBounds(bounds)
  const newBounds = fromLatLngBounds(leafletBounds)
  const reprojectedBounds = reprojectBounds(leafletBounds)

  expect(newBounds.north).toBe(bounds.north)
  expect(newBounds.south).toBe(bounds.south)
  expect(newBounds.east).toBe(bounds.east)
  expect(newBounds.west).toBe(bounds.west)
  expect(reprojectedBounds).toBeInstanceOf(Leaflet.LatLngBounds)
})
