// @flow
import toJSON from 'enzyme-to-json'
import React from 'react'

import Analysis from '../single-point-analysis'
import {mockWithProvider} from '../../utils/mock-data'

describe('Containers > Single Point', function () {
  it('should render correctly', function () {
    const {wrapper} = mockWithProvider(<Analysis />)
    const analysis = wrapper.find('SinglePointAnalysis')
    expect(toJSON(analysis, {mode: 'shallow'})).toMatchSnapshot()
    wrapper.unmount()
  })
})
