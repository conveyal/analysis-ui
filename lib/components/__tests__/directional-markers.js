// @flow
import {mount} from 'enzyme'
import {mountToJson} from 'enzyme-to-json'
import React from 'react'
import {Map} from 'react-leaflet'

import DirectionalMarkers, {
  getDirectionalMarkersForPatterns,
  drawMarkersInTile
} from '../directional-markers'

import {mockPattern} from '../../utils/mock-data'

describe('Component > DirectionalMarkers', () => {
  it('renders correctly', () => {
    const wrapper = mount(
      <Map>
        <DirectionalMarkers
          color='#fffff'
          patterns={[mockPattern]}
        />
      </Map>
    )
    expect(mountToJson(wrapper)).toMatchSnapshot()
  })

  it('generates markers for patterns in a tile correctly', () => {
    const z = 12
    const markers = getDirectionalMarkersForPatterns([mockPattern], z)
    const draw = jest.fn()
    drawMarkersInTile(markers, {x: 659, y: 1592}, z, draw)
    expect(draw).toHaveBeenCalledTimes(2)
  })
})
