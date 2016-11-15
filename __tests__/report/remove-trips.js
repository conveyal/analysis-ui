/* global describe, it, expect */

import React from 'react'
import renderer from 'react-test-renderer'

import { mockFeed, mockModification } from '../test-utils/mock-data'

describe('Report > RemoveTrips', () => {
  const RemoveTrips = require('../../lib/report/remove-trips')

  it('renders correctly', () => {
    const props = {
      feedsById: { '1': mockFeed },
      modification: mockModification
    }

    // mount component
    const tree = renderer.create(
      <RemoveTrips
        {...props}
        />
    )
    expect(tree).toMatchSnapshot()
  })
})
