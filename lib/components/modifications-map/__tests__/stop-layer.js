// @flow
import enzyme from 'enzyme'
import React from 'react'

import StopLayer from '../stop-layer'
import {mockFeed, mockModification} from '../../../utils/mock-data'

describe('Project-Map > StopLayer', () => {
  it('renders correctly', () => {
    const props = {
      feed: mockFeed,
      modification: mockModification,
      nullIsWildcard: true,
      onSelect: jest.fn(),
      selectedColor: 'blue',
      unselectedColor: 'red'
    }

    // mount component
    const tree = enzyme.shallow(<StopLayer {...props} />)
    expect(tree).toMatchSnapshot()
  })
})
