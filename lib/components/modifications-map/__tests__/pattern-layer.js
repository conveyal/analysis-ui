// @flow
import enzyme from 'enzyme'
import React from 'react'

import PatternLayer from '../pattern-layer'
import {mockFeed, mockModification} from '../../../utils/mock-data'

describe('Project-Map > PatternLayer', () => {
  it('renders correctly', () => {
    const props = {
      activeTrips: [],
      color: 'blue',
      dim: true,
      feed: mockFeed,
      modification: mockModification
    }

    // mount component
    const tree = enzyme.shallow(<PatternLayer {...props} />)
    expect(tree).toMatchSnapshot()
  })
})
