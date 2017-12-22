// @flow

import React from 'react'
import renderer from 'react-test-renderer'

import Reroute from '../reroute'
import {mockFeed, mockModification, mockSegment} from '../../../utils/mock-data'

mockModification.segments.push(mockSegment)

describe('Report > Reroute', () => {
  it('renders correctly', () => {
    const props = {
      feedsById: {'1': mockFeed},
      modification: {
        ...mockModification,
        segmentSpeeds: mockModification.segments.map(s => 10)
      }
    }

    // mount component
    const tree = renderer.create(<Reroute {...props} />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
