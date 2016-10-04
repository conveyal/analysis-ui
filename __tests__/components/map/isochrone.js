/* global describe, it, expect, jest */

import React from 'react'
import renderer from 'react-test-renderer'

import Isochrone from '../../../lib/components/map/isochrone'

jest.mock('react-dom')
const {Map} = jest.genMockFromModule('react-leaflet')

describe('Components > Map > Isochrone', () => {
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
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
