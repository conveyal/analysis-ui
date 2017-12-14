// @flow

import React from 'react'
import {Map} from 'react-leaflet'
import renderer from 'react-test-renderer'

import HopLayer from '../hop-layer'
import {mockFeed, mockModification} from '../../../utils/mock-data'

// get around flow sealed object
const mockModificationWithHops = {
  ...mockModification,
  hops: []
}

describe('Project-Map > HopLayer', () => {
  it('renders correctly', () => {
    const props = {
      color: 'blue',
      feed: mockFeed,
      modification: mockModificationWithHops
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
