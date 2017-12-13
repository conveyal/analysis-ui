// @flow

import React from 'react'
import renderer from 'react-test-renderer'

import RemoveStops from '../remove-stops'
import {mockFeed, mockModification} from '../../../utils/mock-data'

describe('Report > RemoveStops', () => {
  it('renders correctly', () => {
    const props = {
      feedsById: {'1': mockFeed},
      modification: mockModification
    }

    // mount component
    const tree = renderer.create(<RemoveStops {...props} />)
    expect(tree).toMatchSnapshot()
  })
})
