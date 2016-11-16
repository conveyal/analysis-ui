/* global describe, it, expect, jest */

import React from 'react'
import { Map } from 'react-leaflet'
import renderer from 'react-test-renderer'

describe('Components > Map > Isochrone', () => {
  const Isochrone = require('../../../lib/components/map/isochrone')

  it('renders correctly', () => {
    const props = {
      bundleId: 'bundle-id',
      fetchIsochrone: jest.fn(),
      isochroneLatLng: {
        lat: 38.898,
        lon: -77.015
      },
      modifications: [],
      remove: jest.fn(),
      scenarioId: 'scenario-id'
    }

    const tree = renderer.create(
      <Map>
        <Isochrone
          {...props}
          />
      </Map>
    )
    expect(tree).toMatchSnapshot()

    // expect isochrone marker to be added to map by intercepting call to Leaflet
    // expect(Leaflet.marker.mock.calls[0][0]).toMatchSnapshot()
  })
})
