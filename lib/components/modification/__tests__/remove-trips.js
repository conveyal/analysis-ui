/* global describe, it, expect, jest */

import renderer from 'react-test-renderer'
import React from 'react'

import { mockFeed } from '../../../utils/mock-data'

import RemoveTrips from '../remove-trips'

describe('Component > Modification > RemoveTrips', () => {
  it('renders correctly', () => {
    const props = {
      feeds: [mockFeed],
      feedsById: { '1': mockFeed },
      modification: {},
      update: jest.fn()
    }
    const tree = renderer.create(
      <RemoveTrips
        {...props}
        />
    ).toJSON()
    expect(tree).toMatchSnapshot()
    expect(props['update']).not.toBeCalled()
  })
})
