// @flow
import enzyme from 'enzyme'
import React from 'react'

import HopLayer from '../hop-layer'
import {mockFeed, mockModification} from '../../../utils/mock-data'

// get around flow sealed object
const mockModificationWithHops = {
  ...mockModification,
  hops: []
}

describe('Project-Map > HopLayer', () => {
  it('renders correctly', () => {
    const props = {
      color: 'blue',
      feed: mockFeed,
      modification: mockModificationWithHops
    }

    // mount component
    const tree = enzyme.shallow(<HopLayer {...props} />)
    expect(tree).toMatchSnapshot()
  })
})
