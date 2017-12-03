/* global describe, expect, it, jest */

import renderer from 'react-test-renderer'
import React from 'react'
import {Map} from 'react-leaflet'

import {mockStops, mockModification} from '../../../utils/mock-data'

import StopSelectPolygon from '../stop-select-polygon'

describe('Project-Map > StopSelectPolygon', () => {
  it('renders correctly', () => {
    const props = {
      action: 'new',
      modification: mockModification,
      replaceModification: jest.fn(),
      routeStops: mockStops,
      setMapState: jest.fn()
    }

    // mount component
    const tree = renderer
      .create(
        <Map>
          <StopSelectPolygon {...props} />
        </Map>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()

    const noCalls = ['replaceModification', 'setMapState']
    noCalls.forEach(fn => {
      expect(props[fn]).not.toBeCalled()
    })
  })
})
