// @flow
import enzyme from 'enzyme'
import React from 'react'

import Region from '../region'

describe('Component > Region', () => {
  it('renders correctly', () => {
    const tree = enzyme.mount(
      <Region
        description='A test region'
        id='1234'
        isLoaded={false}
        name='Test'
      >
        Region content
      </Region>
    )
    expect(tree).toMatchSnapshot()
    tree.unmount()
  })
})
