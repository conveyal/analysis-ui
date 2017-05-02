/* global describe, it, expect, jest */

import renderer from 'react-test-renderer'
import React from 'react'

import {mockFeed, mockPattern} from '../../../utils/mock-data'

import RemoveTrips from '../remove-trips'

describe('Component > Modification > RemoveTrips', () => {
  it('renders correctly', () => {
    const props = {
      feeds: [mockFeed],
      modification: {},
      routePatterns: [mockPattern],
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
