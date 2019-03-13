// @flow
import React from 'react'

import {mockWithProvider} from '../../utils/mock-data'
import EditBundle from '../edit-bundle'

const {describe, expect, it} = global
describe('Container > Edit Bundle', () => {
  it('renders correctly', () => {
    const props = {
      params: {
        bundleId: '1'
      }
    }
    const {wrapper} = mockWithProvider(<EditBundle {...props} />)
    expect(wrapper).toMatchSnapshot()
    wrapper.unmount()
  })
})
