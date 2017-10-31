// @flow
import React from 'react'

import Heading from '../heading'

const {describe, expect, it} = global
describe('Opportunity Datasets > Components > Heading', () => {
  it('should render', () => {
    expect(<Heading />).toMatchSnapshot()
  })
})
