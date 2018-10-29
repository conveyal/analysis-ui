// @flow
import renderer from 'react-test-renderer'
import React from 'react'
import {Map} from 'react-leaflet'

import GTFSStopGridLayer, {drawStopsInTile} from '../gtfs-stop-gridlayer'
import {mockGtfsStops} from '../../../utils/mock-data.js'

describe('Component > GTFSStopGridLayer', () => {
  it('renders correctly', () => {
    const props = {
      stops: mockGtfsStops
    }

    // mount component
    const tree = renderer
      .create(
        <Map>
          <GTFSStopGridLayer {...props} />
        </Map>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('should draw stops within a tile', () => {
    const draw = jest.fn()
    drawStopsInTile(mockGtfsStops, {x: 659, y: 1593}, 12, draw)
    expect(draw).toHaveBeenCalledTimes(1)
  })
})
