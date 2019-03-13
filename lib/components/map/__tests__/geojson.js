// @flow
import enzyme from 'enzyme'
import React from 'react'

import GeoJSON from '../geojson'

describe('Components > Map > GeoJSON', () => {
  it('renders correctly', () => {
    const geojson = {
      type: 'FeatureCollection',
      features: []
    }

    const tree = enzyme.shallow(<GeoJSON data={geojson} />)
    expect(tree).toMatchSnapshot()
  })
})
