/* global describe, it, expect, jest */

import React from 'react'
import { Map } from 'react-leaflet'
import renderer from 'react-test-renderer'

import { mockFeed, mockModification, mockSegment, mockStops } from '../../../../utils/mock-data.js'

mockFeed.stops = mockStops
mockModification.segments = [mockSegment]

describe('Component > Transit-Editor > TransitEditor', () => {
  const TransitEditor = require('../')

  it('renders correctly', () => {
    const props = {
      allowExtend: true,
      extendFromEnd: true,
      feeds: [mockFeed],
      followRoad: true,
      modification: mockModification,
      replaceModification: jest.fn()
    }

    // mount component
    const tree = renderer.create(
      <Map>
        <TransitEditor
          {...props}
          />
      </Map>
    )
    expect(props.replaceModification).not.toBeCalled()
    // expect marker to be added to map by intercepting call to Leaflet
    expect(tree).toMatchSnapshot()
  })
})
