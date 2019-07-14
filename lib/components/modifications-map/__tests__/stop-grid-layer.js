//
import enzyme from 'enzyme'
import Leaflet from 'leaflet'
import React from 'react'

import {GTFSStopGridLayer, drawStopsInTile} from '../gtfs-stop-gridlayer'
import {mockGtfsStops} from '../../../utils/mock-data.js'

jest.mock('leaflet')

describe('Component > GTFSStopGridLayer', () => {
  it('renders correctly', () => {
    const props = {
      leaflet: {
        map: new Leaflet.Map()
      },
      stops: mockGtfsStops
    }

    // mount component and ensure no error is thrown
    enzyme.shallow(<GTFSStopGridLayer {...props} />)
  })

  it('should draw stops within a tile', () => {
    const draw = jest.fn()
    drawStopsInTile(mockGtfsStops, {x: 659, y: 1593}, 12, draw)
    expect(draw).toHaveBeenCalledTimes(1)
  })
})
