//
import enzyme from 'enzyme'
import React from 'react'

import CreateRegion from '../create-region'

describe('Components > Create Region', () => {
  it('renders correctly', () => {
    const wrapper = enzyme.shallow(<CreateRegion create={jest.fn()} />)
    expect(wrapper).toMatchSnapshot()
    wrapper.unmount()
  })
})
