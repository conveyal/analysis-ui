// @flow
import mock from 'jest-mock'
import Leaflet from 'leaflet'
import React from 'react'
import {Map} from 'react-leaflet'
import renderer from 'react-test-renderer'

import EditBounds from '../edit-bounds'

describe('Components > Map > Edit Bounds', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <Map>
        <EditBounds
          bounds={new Leaflet.LatLngBounds([40, -71], [41, -72])}
          save={mock.fn()}
        />
      </Map>
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
