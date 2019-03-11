// @flow

import renderer from 'react-test-renderer'
import React from 'react'
import {Map} from 'react-leaflet'

import StopSelectPolygon from '../stop-select-polygon'

describe('Project-Map > StopSelectPolygon', () => {
  it('renders correctly', () => {
    const props = {
      routeStops: [{
        stop_id: '1',
        stop_lat: 12,
        stop_lon: 34,
        stop_name: 'mock gtfs stop'
      }],
      selectStops: jest.fn()
    }

    // mount component
    const tree = renderer
      .create(
        <Map>
          <StopSelectPolygon {...props} />
        </Map>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()

    const noCalls = ['selectStops']
    noCalls.forEach(fn => {
      expect(props[fn]).not.toHaveBeenCalled()
    })
  })
})
