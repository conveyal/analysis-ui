// @flow
import mock from 'jest-mock'
import React from 'react'
import {Map} from 'react-leaflet'
import renderer from 'react-test-renderer'

import EditBounds from '../edit-bounds'
import {DEFAULT_BOUNDS} from '../../../constants/region'
import {toLatLngBounds} from '../../../utils/bounds'

describe('Components > Map > Edit Bounds', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <Map>
        <EditBounds
          bounds={toLatLngBounds(DEFAULT_BOUNDS)}
          save={mock.fn()}
        />
      </Map>
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
