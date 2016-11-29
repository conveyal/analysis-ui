/* global describe, expect, it */

import renderer from 'react-test-renderer'
import React from 'react'
import { Map } from 'react-leaflet'

import DirectionalMarkers from '../directional-markers'

describe('Component > DirectionalMarkers', () => {
  it('renders correctly', () => {
    expect(renderer.create(
      <Map>
        <DirectionalMarkers />
      </Map>
    ).toJSON()).toMatchSnapshot()
  })
})
