/* global describe, expect, it, jest */

import React from 'react'
import {Map} from 'react-leaflet'
import renderer from 'react-test-renderer'

import {mockStops, mockModification} from '../../../utils/mock-data'

describe('Scenario-Map > StopSelectSingle', () => {
  const StopSelectSingle = require('../stop-select-single')

  it('renders correctly', () => {
    const props = {
      action: 'new',
      modification: mockModification,
      replaceModification: jest.fn(),
      routeStops: mockStops,
      setMapState: jest.fn()
    }

    // mount component
    renderer.create(
      <Map>
        <StopSelectSingle
          {...props}
          />
      </Map>
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
