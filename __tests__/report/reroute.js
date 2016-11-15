/* global describe, it, expect */

import React from 'react'
import renderer from 'react-test-renderer'

import { mockFeed, mockModification, mockSegment } from '../test-utils/mock-data'

mockModification.segments.push(mockSegment)

describe('Report > Reroute', () => {
  const Reroute = require('../../lib/report/reroute')

  it('renders correctly', () => {
    const props = {
      feedsById: { '1': mockFeed },
      modification: mockModification
    }

    // mount component
    const tree = renderer.create(
      <Reroute
        {...props}
        />
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
