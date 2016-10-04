/* global describe, it, expect, jest */

import React from 'react'
import renderer from 'react-test-renderer'

import GeoJSON from '../../../lib/components/map/geojson'

jest.mock('react-dom')
jest.genMockFromModule('leaflet')
const {Map} = jest.genMockFromModule('react-leaflet')

describe('Components > Map > GeoJSON', () => {
  it('renders correctly', () => {
    const geojson = {
      type: 'FeatureCollection',
      features: []
    }

    const tree = renderer.create(
      <Map>
        <GeoJSON
          data={geojson}
          />
      </Map>
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
