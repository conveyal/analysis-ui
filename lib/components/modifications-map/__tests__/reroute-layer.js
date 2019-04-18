// @flow
import enzyme from 'enzyme'
import React from 'react'

import RerouteLayer from '../reroute-layer'
import {mockFeed, mockModification, mockStop1} from '../../../utils/mock-data'

describe('Project-Map > RerouteLayer', () => {
  it('renders correctly', () => {
    // mount component
    const tree = enzyme.shallow(
      <RerouteLayer
        addedColor='red'
        color='blue'
        dim
        feed={mockFeed}
        highlightSegment={0}
        highlightStop={mockStop1}
        modification={mockModification}
        showAddedSegment
      />
    )
    expect(tree).toMatchSnapshot()
  })
})
