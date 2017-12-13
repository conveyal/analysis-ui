// @flow

import React from 'react'
import {Map} from 'react-leaflet'
import renderer from 'react-test-renderer'

import GeoJsonMousedown from '../geojson-mousedown'

describe('Project-Map > Transit-Editor > GeoJsonMousedown', () => {
  it('renders correctly', () => {
    const props = {
      data: {
        type: 'FeatureCollection',
        features: []
      }
    }

    // mount component
    const tree = renderer.create(
      <Map>
        <GeoJsonMousedown {...props} />
      </Map>
    )
    expect(tree).toMatchSnapshot()
  })
})
