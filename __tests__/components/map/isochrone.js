/* global describe, it, expect, jest */

import React from 'react'
import renderer from 'react-test-renderer'

import { mockComponents } from '../../../testUtils'

jest.mock('react-leaflet', () => { return mockComponents(['Marker']) })
jest.mock('../../../lib/components/map/geojson', () => 'GeoJson')

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
      <Isochrone
        {...props}
        />
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
