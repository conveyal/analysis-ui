// @flow

import React from 'react'
import {Map} from 'react-leaflet'
import renderer from 'react-test-renderer'

import TransitEditor from '../'
import {
  mockFeed,
  mockModification,
  mockSegment,
  mockGtfsStops
} from '../../../../utils/mock-data.js'

mockFeed.stops = mockGtfsStops
mockModification.segments = [mockSegment]

describe('Component > Transit-Editor > TransitEditor', () => {
  it('renders correctly', () => {
    const props = {
      allowExtend: true,
      extendFromEnd: true,
      feeds: [mockFeed],
      followRoad: true,
      modification: mockModification,
      spacing: 0,
      updateModification: jest.fn()
    }

    // mount component
    const tree = renderer.create(
      <Map>
        <TransitEditor {...props} />
      </Map>
    )
    expect(props.updateModification).not.toBeCalled()
    // expect marker to be added to map by intercepting call to Leaflet
    expect(tree).toMatchSnapshot()
  })
})
