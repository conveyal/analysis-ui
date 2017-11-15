/* global describe, it, expect */

import React from 'react'
import {Map} from 'react-leaflet'
import renderer from 'react-test-renderer'

import {mockFeed, mockModification} from '../../../utils/mock-data'

describe('Project-Map > RerouteLayer', () => {
  const RerouteLayer = require('../reroute-layer')

  it('renders correctly', () => {
    const props = {
      color: 'blue',
      dim: true,
      feed: mockFeed,
      modification: mockModification,
      showAddedSegment: true
    }

    // mount component
    const tree = renderer.create(
      <Map>
        <RerouteLayer {...props} />
      </Map>
    )
    expect(tree).toMatchSnapshot()

    // expect geojson to be added to map by intercepting call to Leaflet
    // expect(Leaflet.geoJson.mock.calls[0][0]).toMatchSnapshot()
  })
})
