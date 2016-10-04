/* global describe, it, expect, jest */

import React from 'react'
import {Map} from 'react-leaflet'
import renderer from 'react-test-renderer'

jest.mock('react-dom')

import Isochrone from '../../../lib/components/map/isochrone'

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
