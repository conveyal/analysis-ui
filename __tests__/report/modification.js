/* global describe, expect, it */

import React from 'react'
import renderer from 'react-test-renderer'

import { mockFeed, mockModification } from '../test-utils/mock-data'

mockModification.type = 'adjust-dwell-time'

describe('Report > Modification', () => {
  const Modification = require('../../lib/report/modification')

  it('renders correctly', () => {
    const props = {
      modification: mockModification,
      feedsById: { '1': mockFeed }
    }

    // mount component
    const tree = renderer.create(
      <Modification
        {...props}
        />
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
