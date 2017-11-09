// @flow

import React from 'react'
import {Map} from 'react-leaflet'
import renderer from 'react-test-renderer'

import Patterns from '../geojson-patterns'

describe('Components > Map > GeoJSON-Patterns', () => {
  it('renders correctly', () => {
    const props = {
      patterns: [],
      color: 'blue'
    }

    const tree = renderer
      .create(
        <Map>
          <Patterns {...props} />
        </Map>
      )
      .toJSON()

    // expect geojson to be added to map by intercepting call to Leaflet
    // expect(Leaflet.geoJson.mock.calls[0][0]).toMatchSnapshot()

    expect(tree).toMatchSnapshot()
  })
})
