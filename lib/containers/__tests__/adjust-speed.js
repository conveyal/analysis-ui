import React from 'react'

import {mockWithProvider, mockModification} from '../../utils/mock-data'

import AdjustSpeed from '../adjust-speed'

describe('Containers > AdjustSpeed', () => {
  it('should render without errors', () => {
    const mock = mockWithProvider(<AdjustSpeed modification={mockModification} />)
    mock.wrapper.unmount()
  })
})
