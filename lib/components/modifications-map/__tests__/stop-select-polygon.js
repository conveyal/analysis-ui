// @flow
import enzyme from 'enzyme'
import React from 'react'

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
    const tree = enzyme.shallow(<StopSelectPolygon {...props} />)
    expect(tree).toMatchSnapshot()
    expect(props.selectStops).not.toHaveBeenCalled()
  })
})
