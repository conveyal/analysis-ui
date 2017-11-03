// @flow
import React from 'react'

import {mockWithProvider} from '../../../../utils/mock-data'
import Selector from '../selector'

const {describe, expect, it} = global
describe('Opportunity Datasets > Components > Selector', () => {
  it('should render', () => {
    const {snapshot} = mockWithProvider(<Selector />)
    expect(snapshot()).toMatchSnapshot()
  })
})
