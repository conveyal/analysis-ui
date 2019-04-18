// @flow
import enzyme from 'enzyme'
import React from 'react'

import PatternStopsLayer from '../pattern-stops-layer'
import {mockFeed, mockModification} from '../../../utils/mock-data'

describe('Project-Map > PatternStopsLayer', () => {
  it('renders correctly', () => {
    const props = {
      activeTrips: [],
      color: 'blue',
      dim: true,
      feed: mockFeed,
      modification: mockModification
    }

    // mount component
    const tree = enzyme.shallow(<PatternStopsLayer {...props} />)
    expect(tree).toMatchSnapshot()
  })
})
