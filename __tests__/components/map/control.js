/* global describe, it, expect, jest */

import React from 'react'
import renderer from 'react-test-renderer'

jest.mock('react-select-geocoder', () => 'ReactSelctGeocoder')
jest.mock('../../../lib/components/icon', () => 'Icon')

import Control from '../../../lib/components/map/control'

describe('Component > Map > Control', () => {
  it('renders correctly', () => {
    const props = {
      addIsochroneLayerToMap: jest.fn(),
      center: {
        lat: 38.898,
        lon: -77.015
      },
      clearIsochroneResults: jest.fn(),
      geocoderApiKey: 'MAPZEN_SEARCH_KEY',
      isochroneCutoff: 3600,
      isFetchingIsochrone: false,
      isShowingIsochrone: false,
      removeIsochroneLayerFromMap: jest.fn(),
      setIsochroneCutoff: jest.fn(),
      setIsochroneLatLng: jest.fn()
    }

    const tree = renderer.create(
      <Control
        {...props}
        />
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
