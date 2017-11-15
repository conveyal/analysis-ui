/* global describe, it, expect */

import React from 'react'
import {Map} from 'react-leaflet'
import renderer from 'react-test-renderer'

import {mockFeed, mockModification} from '../../../utils/mock-data'

mockModification.hops = []

describe('Project-Map > HopLayer', () => {
  const HopLayer = require('../hop-layer')
  it('renders correctly', () => {
    const props = {
      color: 'blue',
      feed: mockFeed,
      modification: mockModification
    }

    // mount component
    const tree = renderer
      .create(
        <Map>
          <HopLayer {...props} />
        </Map>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })
})
