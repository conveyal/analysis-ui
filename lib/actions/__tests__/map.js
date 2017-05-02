/* global describe, expect, it */

describe('actions > map', () => {
  const map = require('../map')

  it('addComponent should work', () => {
    expect(map.addComponent()).toMatchSnapshot()
  })

  it('removeComponent should work', () => {
    expect(map.removeComponent()).toMatchSnapshot()
  })

  it('setCenter should work', () => {
    expect(map.setCenter({ lat: 12, lon: 34 })).toMatchSnapshot()
  })

  it('setZoom should work', () => {
    expect(map.setZoom()).toMatchSnapshot()
  })

  it('setMapState should work', () => {
    expect(map.setMapState()).toMatchSnapshot()
  })
})
