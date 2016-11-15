/* global describe, it, expect */

import React from 'react'
import { Map } from 'react-leaflet'
import renderer from 'react-test-renderer'

import { mockFeed, mockModification } from '../test-utils/mock-data'

describe('Scenario-Map > PatternLayer', () => {
  const PatternLayer = require('../../lib/scenario-map/pattern-layer')

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

    // expect geojson to be added to map by intercepting call to Leaflet
    // expect(Leaflet.geoJson.mock.calls[0][0]).toMatchSnapshot()
  })
})
