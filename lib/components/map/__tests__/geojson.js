/* global describe, it, expect */

import React from 'react'
import {Map} from 'react-leaflet'
import renderer from 'react-test-renderer'

import GeoJSON from '../geojson'

describe('Components > Map > GeoJSON', () => {
  it('renders correctly', () => {
    const geojson = {
      type: 'FeatureCollection',
      features: []
    }

    const tree = renderer
      .create(
        <Map>
          <GeoJSON data={geojson} />
        </Map>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()

    // expect geojson to be added to map by intercepting call to Leaflet
    // expect(Leaflet.geoJson.mock.calls[0][0]).toMatchSnapshot()
  })
})
