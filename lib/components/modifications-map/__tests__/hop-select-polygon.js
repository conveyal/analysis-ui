//
import enzyme from 'enzyme'
import React from 'react'

import HopSelectPolygon from '../hop-select-polygon'

describe('Project-Map > HopSelectPolygon', () => {
  it('renders correctly', () => {
    // mount component
    const tree = enzyme.shallow(
      <HopSelectPolygon allStops={[]} hopStops={[]} selectHops={jest.fn()} />
    )
    expect(tree).toMatchSnapshot()
  })
})
