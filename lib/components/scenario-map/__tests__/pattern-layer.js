/* global describe, it, expect */

import React from 'react'
import { Map } from 'react-leaflet'
import renderer from 'react-test-renderer'

import { mockFeed, mockModification } from '../../../utils/mock-data'

describe('Scenario-Map > PatternLayer', () => {
  const PatternLayer = require('../pattern-layer')

  it('renders correctly', () => {
    const props = {
      activeTrips: [],
      color: 'blue',
      dim: true,
      feed: mockFeed,
      modification: mockModification
    }

    // mount component
    const tree = renderer.create(
      <Map>
        <PatternLayer
          {...props}
          />
      </Map>
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
