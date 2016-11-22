/* global describe, it, expect, jest */

import { mount } from 'enzyme'
import { mountToJson } from 'enzyme-to-json'
import React from 'react'

import Control from '../control'

describe('Component > Map > Control', () => {
  it('renders correctly', () => {
    const props = {
      addIsochroneLayerToMap: jest.fn(),
      center: {
        lat: 38.898,
        lon: -77.015
      },
      clearIsochroneResults: jest.fn(),
      fetchIsochrone: jest.fn(),
      geocoderApiKey: 'MAPZEN_SEARCH_KEY',
      isochroneCutoff: 3600,
      isFetchingIsochrone: false,
      isShowingIsochrone: false,
      removeIsochroneLayerFromMap: jest.fn(),
      setIsochroneCutoff: jest.fn(),
      setIsochroneLatLng: jest.fn()
    }

    const tree = mount(
      <Control
        {...props}
        />
    )
    expect(mountToJson(tree)).toMatchSnapshot()
  })
})
