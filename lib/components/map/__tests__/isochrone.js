// @flow
import {shallow} from 'enzyme'
import toJSON from 'enzyme-to-json'
import Leaflet from 'leaflet'
import React from 'react'

import {Isochrone} from '../isochrone'

jest.mock('leaflet')

describe('Components > Map > Isochrone', () => {
  it('renders correctly', () => {
    const props = {
      comparisonInProgress: false,
      comparisonIsochrone: null,
      isDestinationTravelTimeDistributionComponentOnMap: false,
      isFetchingIsochrone: false,
      isochrone: null,
      isochroneCutoff: 10,
      isochroneLonLat: { lat: 38.898, lon: -77.015 },
      isochroneIsStale: false,
      leaflet: {
        map: new Leaflet.Map()
      },
      variantIndex: 1,

      // actions
      addDestinationTravelTimeDistributionComponentToMap: jest.fn(),
      fetchTravelTimeSurface: jest.fn(),
      remove: jest.fn(),
      removeDestinationTravelTimeDistributionComponentFromMap: jest.fn(),
      setDestination: jest.fn(),
      setIsochroneLonLat: jest.fn()
    }

    const tree = shallow(<Isochrone {...props} />)
    expect(toJSON(tree)).toMatchSnapshot()
  })
})
