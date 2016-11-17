/* global describe, expect, it */

import React from 'react'
import {Map} from 'react-leaflet'
import renderer from 'react-test-renderer'

describe('Scenario-Map > Transit-Editor > GeoJsonMousedown', () => {
  const GeoJsonMousedown = require('../geojson-mousedown')

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
        <GeoJsonMousedown
          {...props}
          />
      </Map>
    )
    expect(tree).toMatchSnapshot()
  })
})
