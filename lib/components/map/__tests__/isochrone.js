/* global describe, it, expect, jest */

import React from 'react'
import {Map} from 'react-leaflet'
import renderer from 'react-test-renderer'

describe('Components > Map > Isochrone', () => {
  const Isochrone = require('../isochrone')

  it('renders correctly', () => {
    const props = {
      bundleId: 'bundle-id',
      comparisonInProgress: false,
      currentOpportunityDataset: 'current-opportunity-dataset-id',
      fetchIsochrone: jest.fn(),
      isochroneLonLat: {
        lon: -77.015,
        lat: 38.898
      },
      isFetchingIsochrone: false,
      modifications: [],
      profileRequest: {},
      remove: jest.fn(),
      scenarioId: 'scenario-id',
      workerVersion: 'v1.5.0',
      variantIndex: 1
    }

    const tree = renderer.create(
      <Map>
        <Isochrone {...props} />
      </Map>
    )
    expect(tree).toMatchSnapshot()

    // expect isochrone marker to be added to map by intercepting call to Leaflet
    // expect(Leaflet.marker.mock.calls[0][0]).toMatchSnapshot()
  })
})
