/* global describe, it, expect */

import React from 'react'
import renderer from 'react-test-renderer'

import { mockFeed, mockModification } from '../test-utils/mock-data'

describe('Report > AdjustSpeed', () => {
  const AdjustSpeed = require('../../lib/report/adjust-speed')

  it('renders correctly', () => {
    const props = {
      feedsById: { '1': mockFeed },
      modification: mockModification
    }

    // mount component
    const tree = renderer.create(
      <AdjustSpeed
        {...props}
        />
    )
    expect(tree).toMatchSnapshot()
  })
})
