// @flow
import reproject from '../reproject-coordinates'

describe('utils > reproject-coordinates', () => {
  it('should snap a geographic point to the nearest grid point', () => {
    const ll = reproject([39, 70])
    expect(ll.lat).toBe(39.00211029922515)
    expect(ll.lng).toBe(69.99938964843751)
  })
})
