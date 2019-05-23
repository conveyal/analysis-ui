import React from 'react'

import Heading from '../heading'

describe('Opportunity Datasets > Components > Heading', () => {
  it('should render', () => {
    expect(<Heading />).toMatchSnapshot()
  })
})
