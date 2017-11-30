/* global describe, it, expect, jest */

import React from 'react'
import {Map} from 'react-leaflet'
import renderer from 'react-test-renderer'

describe('Components > Map > EditRegionBounds', () => {
  const EditRegionBounds = require('../edit-region-bounds')

  it('renders correctly', () => {
    const props = {
      bounds: {
        north: 12,
        east: -34,
        south: -34,
        west: 12
      },
      isLoaded: true,
      saveLocally: jest.fn()
    }

    const tree = renderer.create(
      <Map>
        <EditRegionBounds {...props} />
      </Map>
    )
    expect(tree).toMatchSnapshot()
  })
})
