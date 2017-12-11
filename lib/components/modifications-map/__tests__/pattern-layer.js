// @flow

import React from 'react'
import {Map} from 'react-leaflet'
import renderer from 'react-test-renderer'

import PatternLayer from '../pattern-layer'
import {mockFeed, mockModification} from '../../../utils/mock-data'

describe('Project-Map > PatternLayer', () => {
  it('renders correctly', () => {
    const props = {
      activeTrips: [],
      color: 'blue',
      dim: true,
      feed: mockFeed,
      modification: mockModification
    }

    // mount component
    const tree = renderer
      .create(
        <Map>
          <PatternLayer {...props} />
        </Map>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })
})
