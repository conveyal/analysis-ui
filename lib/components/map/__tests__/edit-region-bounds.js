// @flow

import React from 'react'
import {Map} from 'react-leaflet'
import renderer from 'react-test-renderer'

import EditRegionBounds from '../edit-region-bounds'
import {mockRegion} from '../../../utils/mock-data'

describe('Components > Map > EditProjectBounds', () => {
  it('renders correctly', () => {
    const props = {
      bounds: mockRegion.bounds,
      isLoaded: true,
      region: mockRegion,
      setLocally: jest.fn()
    }

    const tree = renderer.create(
      <Map>
        <EditRegionBounds {...props} />
      </Map>
    )
    expect(tree).toMatchSnapshot()
  })
})
