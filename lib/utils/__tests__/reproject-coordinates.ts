import {expect} from '@jest/globals'
import reproject from '../reproject-coordinates'

describe('utils > reproject-coordinates', () => {
  it('should snap a geographic point to the nearest grid point', () => {
    const ll = reproject({lat: 39, lon: 70})
    expect(ll.lat).toBe(38.99997583555928)
    expect(ll.lon).toBe(69.9993896484375)
  })
})
