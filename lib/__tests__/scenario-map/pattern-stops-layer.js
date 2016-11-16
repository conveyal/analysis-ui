/* global describe, it, expect */

import React from 'react'
import { Map } from 'react-leaflet'
import renderer from 'react-test-renderer'

import { mockFeed, mockModification } from '../test-utils/mock-data'

describe('Scenario-Map > PatternStopsLayer', () => {
  const PatternStopsLayer = require('../../lib/scenario-map/pattern-stops-layer')

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
        <PatternStopsLayer
          {...props}
          />
      </Map>
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
