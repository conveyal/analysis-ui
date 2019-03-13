// @flow
import enzyme from 'enzyme'
import Leaflet from 'leaflet'
import React from 'react'

import {AddTripPatternLayer} from '../add-trip-pattern-layer'
import {mockSegment} from '../../../utils/mock-data'

jest.mock('leaflet')

describe('Project-Map > AddTripPatternLayer', () => {
  it('renders correctly', () => {
    // mount component
    expect(enzyme.shallow(
      <AddTripPatternLayer
        leaflet={{
          map: new Leaflet.Map()
        }}
        segments={[mockSegment]}
        bidirectional={false}
      />
    )).toMatchSnapshot()
  })
})
