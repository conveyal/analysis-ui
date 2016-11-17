/* global describe, it, expect */

import React from 'react'
import renderer from 'react-test-renderer'

import { mockFeed, mockModification } from '../../../utils/mock-data'

describe('Report > AdjustDwellTime', () => {
  const AdjustDwellTime = require('../adjust-dwell-time')

  it('renders correctly', () => {
    const props = {
      feedsById: { '1': mockFeed },
      modification: mockModification
    }

    // mount component
    const tree = renderer.create(
      <AdjustDwellTime
        {...props}
        />
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
