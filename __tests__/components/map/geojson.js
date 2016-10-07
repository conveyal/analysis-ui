/* global describe, it, expect, jest */

import React from 'react'
import renderer from 'react-test-renderer'

jest.mock('react-leaflet', () => {
  return {
    GeoJson: class mockGeoJson extends React.Component {
      render () {
        return (
          <mockGeoJson
            {...this.props}
            />
        )
      }
    }
  }
})

import GeoJSON from '../../../lib/components/map/geojson'

describe('Components > Map > GeoJSON', () => {
  it('renders correctly', () => {
    const geojson = {
      type: 'FeatureCollection',
      features: []
    }

    const tree = renderer.create(
      <GeoJSON
        data={geojson}
        />
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
