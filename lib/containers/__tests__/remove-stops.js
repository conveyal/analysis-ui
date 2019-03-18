import React from 'react'

import {mockWithProvider, mockModification} from '../../utils/mock-data'
import RemoveStops from '../remove-stops'

describe('Containers > RemoveStops', () => {
  it('should render without errors', () => {
    const mock = mockWithProvider(<RemoveStops modification={mockModification} />)
    mock.wrapper.unmount()
  })
})
