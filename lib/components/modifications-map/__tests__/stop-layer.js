/* global describe, expect, it, jest */

import React from 'react'
import {Map} from 'react-leaflet'
import renderer from 'react-test-renderer'

import {mockFeed, mockModification} from '../../../utils/mock-data'

describe('Project-Map > StopLayer', () => {
  const StopLayer = require('../stop-layer')

  it('renders correctly', () => {
    const props = {
      feed: mockFeed,
      modification: mockModification,
      nullIsWildcard: true,
      onSelect: jest.fn(),
      selectedColor: 'blue',
      unselectedColor: 'red'
    }

    // mount component
    const tree = renderer.create(
      <Map>
        <StopLayer {...props} />
      </Map>
    )
    expect(tree).toMatchSnapshot()
  })
})
