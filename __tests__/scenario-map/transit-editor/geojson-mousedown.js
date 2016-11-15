/* global describe, expect, it */

import React from 'react'
import {Map} from 'react-leaflet'
import renderer from 'react-test-renderer'

describe('Scenario-Map > Transit-Editor > GeoJsonMousedown', () => {
  const GeoJsonMousedown = require('../../../lib/scenario-map/transit-editor/geojson-mousedown')

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

    // expect geojson to be added to map by intercepting call to Leaflet
    // expect(Leaflet.geoJson.mock.calls[0][0]).toMatchSnapshot()
  })
})
