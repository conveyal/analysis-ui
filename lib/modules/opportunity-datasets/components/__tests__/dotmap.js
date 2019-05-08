//
import enzyme from 'enzyme'
import React from 'react'

import Dotmap from '../dotmap'

describe('Opportunity Datasets > Components > Dotmap', () => {
  it('should render without throwing an error', () => {
    enzyme.shallow(<Dotmap />)
  })
})
