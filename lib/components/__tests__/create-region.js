// @flow
import React from 'react'
import mock from 'jest-mock'

import CreateRegion from '../create-region'
import {mockWithProvider} from '../../utils/mock-data'

describe('Components > Create Region', () => {
  it('renders correctly', () => {
    const {wrapper} = mockWithProvider(<CreateRegion create={mock.fn()} />)
    expect(wrapper.exists('CreateRegion')).toBeTruthy()
  })
})
