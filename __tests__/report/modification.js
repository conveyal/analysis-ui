/* global describe, expect, it, jest */

import React from 'react'
import renderer from 'react-test-renderer'

import { mockFeed, mockModification } from '../test-utils/mock-data'

jest.mock('react-dom')
jest.mock('react-leaflet')
jest.mock('react/lib/ReactDefaultInjection')

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
