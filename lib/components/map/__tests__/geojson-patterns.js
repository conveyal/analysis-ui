// @flow
import enzyme from 'enzyme'
import React from 'react'

import Patterns from '../geojson-patterns'

describe('Components > Map > GeoJSON-Patterns', () => {
  it('renders correctly', () => {
    const props = {
      patterns: [],
      color: 'blue'
    }

    const tree = enzyme.shallow(<Patterns {...props} />)
    expect(tree).toMatchSnapshot()
  })
})
