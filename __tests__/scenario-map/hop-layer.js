/* global describe, it, expect */

import React from 'react'
import { Map } from 'react-leaflet'
import renderer from 'react-test-renderer'

import { mockFeed, mockModification } from '../test-utils/mock-data'

mockModification.hops = []

describe('Scenario-Map > HopLayer', () => {
  const HopLayer = require('../../lib/scenario-map/hop-layer')
  it('renders correctly', () => {
    const props = {
      color: 'blue',
      feed: mockFeed,
      modification: mockModification
    }

    // mount component
    const tree = renderer.create(
      <Map>
        <HopLayer
          {...props}
          />
      </Map>
    ).toJSON()
    expect(tree).toMatchSnapshot()

    // expect geojson to be added to map by intercepting call to Leaflet
    // expect(Leaflet.geoJson.mock.calls[0][0]).toMatchSnapshot()
  })
})
