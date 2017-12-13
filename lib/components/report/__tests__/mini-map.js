// @flow

import {latLngBounds} from 'leaflet'
import React from 'react'
import renderer from 'react-test-renderer'

import MiniMap from '../mini-map'

describe('Report > MiniMap', () => {
  it('renders correctly', () => {
    const props = {
      bounds: latLngBounds([[40.712, -74.227], [40.774, -74.125]])
    }

    // mount component
    const tree = renderer.create(<MiniMap {...props} />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
