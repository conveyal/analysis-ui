// @flow
import React from 'react'

import {mockWithProvider} from '../../../../utils/mock-data'
import Upload from '../upload'

const {describe, expect, it} = global
describe('Opportunity Datasets > Components > Upload', () => {
  it('should render', () => {
    const {json} = mockWithProvider(<Upload />)
    expect(json).toMatchSnapshot()
  })
})
