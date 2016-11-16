/* global describe, it, expect */

import React from 'react'
import {Map} from 'react-leaflet'
import renderer from 'react-test-renderer'

import {mockSegment} from '../test-utils/mock-data'

describe('Scenario-Map > AddTripPatternLayer', () => {
  const AddTripPatternLayer = require('../../lib/scenario-map/add-trip-pattern-layer')
  it('renders correctly', () => {
    const props = {
      segments: [mockSegment]
    }

    // mount component
    const tree = renderer.create(
      <Map>
        <AddTripPatternLayer
          {...props}
          />
      </Map>
    ).toJSON()
    expect(tree).toMatchSnapshot()

    // expect geojson to be added to map by intercepting call to Leaflet
    // expect(Leaflet.geoJson.mock.calls[0][0]).toMatchSnapshot()

    // expect circleMarker to be added to map by intercepting call to Leaflet
    // expect(Leaflet.circleMarker.mock.calls[0][0]).toMatchSnapshot()
  })
})
