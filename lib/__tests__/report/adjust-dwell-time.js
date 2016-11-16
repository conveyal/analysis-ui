/* global describe, it, expect */

import React from 'react'
import renderer from 'react-test-renderer'

import { mockFeed, mockModification } from '../test-utils/mock-data'

describe('Report > AdjustDwellTime', () => {
  const AdjustDwellTime = require('../../lib/report/adjust-dwell-time')

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
