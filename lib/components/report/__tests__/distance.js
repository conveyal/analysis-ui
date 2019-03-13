// @flow
import enzyme from 'enzyme'
import React from 'react'

import Distance from '../distance'

describe('Report > Distance', () => {
  it('renders correctly', () => {
    const props = {
      km: 2
    }

    // mount component
    const tree = enzyme.shallow(<Distance {...props} />)
    expect(tree).toMatchSnapshot()
  })
})
