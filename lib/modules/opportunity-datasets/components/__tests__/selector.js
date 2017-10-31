// @flow
import React from 'react'

import {mockWithProvider} from '../../../../utils/mock-data'
import Selector from '../selector'

const {describe, expect, it} = global
describe('Opportunity Datasets > Components > Selector', () => {
  it('should render', () => {
    const {json} = mockWithProvider(<Selector />)
    expect(json).toMatchSnapshot()
  })
})
