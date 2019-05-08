//
import enzyme from 'enzyme'
import React from 'react'

import AdjustSpeedLayer from '../adjust-speed-layer'
import {mockFeed, mockModification} from '../../../utils/mock-data'

describe('Project-Map > AdjustSpeedLayer', () => {
  it('renders correctly', () => {
    // mount component
    const tree = enzyme.shallow(
      <AdjustSpeedLayer feed={mockFeed} modification={mockModification} />
    )
    expect(tree).toMatchSnapshot()
  })
})
