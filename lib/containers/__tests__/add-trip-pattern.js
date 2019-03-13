import React from 'react'

import {mockModification, mockWithProvider} from '../../utils/mock-data'

import AddTripPattern from '../add-trip-pattern'

describe('Containers > AddTripPattern', () => {
  it('should render without errors', () => {
    const setMapState = jest.fn()
    const mock = mockWithProvider(
      <AddTripPattern
        modification={mockModification}
        setMapState={setMapState}
      />
    )
    mock.wrapper.unmount()
  })
})
