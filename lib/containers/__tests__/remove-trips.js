import React from 'react'

import {mockWithProvider, mockModification} from '../../utils/mock-data'

import RemoveTrips from '../remove-trips'

describe('Containers > RemoveTrips', () => {
  it('should render without errors', () => {
    const mock = mockWithProvider(<RemoveTrips modification={mockModification} />)
    mock.wrapper.unmount()
  })
})
