/* global describe, it, expect */

import React from 'react'
import { Map } from 'react-leaflet'
import renderer from 'react-test-renderer'

import { mockFeed, mockModification } from '../../../utils/mock-data'

describe('Scenario-Map > AdjustSpeedLayer', () => {
  const AdjustSpeedLayer = require('../adjust-speed-layer')

  it('renders correctly', () => {
    // mount component
    const tree = renderer.create(
      <Map>
        <AdjustSpeedLayer
          feed={mockFeed}
          modification={mockModification}
          />
      </Map>
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
