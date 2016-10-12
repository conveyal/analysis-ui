/* global describe, it */

import { mount } from 'enzyme'
import React from 'react'
import { Map } from 'react-leaflet'

import Leaflet from '../../test-utils/mock-leaflet'

import DirectionalMarkers from '../../lib/components/directional-markers'

describe('Component > DirectionalMarkers', () => {
  it('renders correctly', () => {
    mount(
      <Map>
        <DirectionalMarkers />
      </Map>
    , {
      attachTo: document.getElementById('test')
    })
    Leaflet.marker  // not really sure what to test here
  })
})
