// @flow

import React from 'react'
import renderer from 'react-test-renderer'

import RemoveTrips from '../remove-trips'
import {mockFeed, mockModification} from '../../../utils/mock-data'

describe('Report > RemoveTrips', () => {
  it('renders correctly', () => {
    const props = {
      feedsById: {'1': mockFeed},
      modification: mockModification
    }

    // mount component
    const tree = renderer.create(<RemoveTrips {...props} />)
    expect(tree).toMatchSnapshot()
  })
})
