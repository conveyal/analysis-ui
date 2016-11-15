/* global describe, expect, it, jest */

import React from 'react'
import { Map } from 'react-leaflet'
import renderer from 'react-test-renderer'

import { mockFeed, mockModification } from '../test-utils/mock-data'

mockModification.hops = []

describe('Scenario-Map > HopSelectPolygon', () => {
  const HopSelectPolygon = require('../../lib/scenario-map/hop-select-polygon')

  it('renders correctly', () => {
    const props = {
      action: 'new',
      feed: mockFeed,
      modification: mockModification,
      replaceModification: jest.fn(),
      setMapState: jest.fn()
    }

    // mount component
    const tree = renderer.create(
      <Map>
        <HopSelectPolygon
          {...props}
          />
      </Map>
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
