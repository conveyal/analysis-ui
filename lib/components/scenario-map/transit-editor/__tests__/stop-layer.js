/* global describe, it */

import { mount } from 'enzyme'
import React from 'react'
import { Map } from 'react-leaflet'

import { mockStops } from '../../../../utils/mock-data.js'

describe('Component > Transit-Editor > StopLayer', () => {
  const StopLayer = require('../stop-layer')

  it('renders correctly', () => {
    const props = {
      stops: mockStops
    }

    // mount component
    mount(
      <Map>
        <StopLayer
          {...props}
          />
      </Map>
      , {
        attachTo: document.getElementById('test')
      }
    )
  })
})
