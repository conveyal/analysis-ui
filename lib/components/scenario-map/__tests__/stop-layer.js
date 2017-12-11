// @flow

import React from 'react'
import {Map} from 'react-leaflet'
import renderer from 'react-test-renderer'

import StopLayer from '../stop-layer'
import {mockFeed, mockModification} from '../../../utils/mock-data'

describe('Scenario-Map > StopLayer', () => {
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
