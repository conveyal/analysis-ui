import enzyme from 'enzyme'
import React from 'react'

import {mockRegion} from 'lib/utils/mock-data'

import SelectRegion from '../select-region'

describe('Component > SelectRegion', () => {
  it('renders correctly', () => {
    const tree = enzyme.shallow(<SelectRegion regions={[mockRegion]} />)
    expect(tree).toMatchSnapshot()
    tree.unmount()
  })
})
