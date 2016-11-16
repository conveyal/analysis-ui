/* global describe, it, expect */

import React from 'react'
import renderer from 'react-test-renderer'

import { mockFeed, mockModification } from '../test-utils/mock-data'

describe('Report > RemoveStops', () => {
  const RemoveStops = require('../../lib/report/remove-stops')

  it('renders correctly', () => {
    const props = {
      feedsById: { '1': mockFeed },
      modification: mockModification
    }

    // mount component
    const tree = renderer.create(
      <RemoveStops
        {...props}
        />
    )
    expect(tree).toMatchSnapshot()
  })
})
