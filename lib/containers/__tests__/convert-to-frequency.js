import React from 'react'

import {mockWithProvider, mockModification} from '../../utils/mock-data'

import ConvertToFrequency from '../convert-to-frequency'

describe('Containers > ConvertToFrequency', () => {
  it('should render without errors', () => {
    const mock = mockWithProvider(<ConvertToFrequency modification={mockModification} />)
    mock.wrapper.unmount()
  })
})
