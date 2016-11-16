/* global describe, it, jest */

import DrawPolygon from '../../lib/scenario-map/draw-polygon'

describe('Scenario-Map > DrawPolygon', () => {
  it('works correctly', () => {
    // initialize
    const mockCallback = jest.fn()
    const drawer = new DrawPolygon(mockCallback)

    // add to map
    const mockMap = { on: jest.fn() }
    drawer.onAdd(mockMap)
    drawer.onRemove(mockMap)
  })
})
