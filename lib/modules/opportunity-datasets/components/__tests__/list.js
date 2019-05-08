//
import React from 'react'

import {mockWithProvider} from '../../../../utils/mock-data'
import List from '../list'

const {describe, expect, it} = global
describe('Opportunity Datasets > Components > List', () => {
  it('should render', () => {
    const {snapshot} = mockWithProvider(<List />)
    expect(snapshot()).toMatchSnapshot()
  })
})
