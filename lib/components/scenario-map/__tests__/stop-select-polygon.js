/* global describe, expect, it, jest */

import { mount } from 'enzyme'
import React from 'react'
import { Map } from 'react-leaflet'

import { mockStops, mockModification } from '../../../utils/mock-data'

import StopSelectPolygon from '../stop-select-polygon'

describe('Scenario-Map > StopSelectPolygon', () => {
  it('renders correctly', () => {
    const props = {
      action: 'new',
      modification: mockModification,
      replaceModification: jest.fn(),
      routeStops: mockStops,
      setMapState: jest.fn()
    }

    // mount component
    mount(
      <Map>
        <StopSelectPolygon
          {...props}
          />
      </Map>
      , {
        attachTo: document.getElementById('test')
      }
    )

    const noCalls = [
      'replaceModification',
      'setMapState'
    ]
    noCalls.forEach((fn) => {
      expect(props[fn]).not.toBeCalled()
    })
  })
})
