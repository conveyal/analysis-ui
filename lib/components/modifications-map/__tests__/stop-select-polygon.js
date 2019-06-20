import React from 'react'
import {Map} from 'react-leaflet'

import {testAndSnapshot} from 'lib/utils/component'

import StopSelectPolygon from '../stop-select-polygon'

const props = {
  routeStops: [
    {
      stop_id: '1',
      stop_lat: 12,
      stop_lon: 34,
      stop_name: 'mock gtfs stop'
    }
  ],
  selectStops: jest.fn()
}

function StopSelectPolygonTest(props) {
  return (
    <Map>
      <StopSelectPolygon {...props} />
    </Map>
  )
}

testAndSnapshot(StopSelectPolygonTest, props)
