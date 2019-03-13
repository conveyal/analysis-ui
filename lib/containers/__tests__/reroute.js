import React from 'react'

import {mockWithProvider, mockModification} from '../../utils/mock-data'

import Reroute from '../reroute'

describe('Containers > Reroute', () => {
  it('should render without errors', () => {
    const mock = mockWithProvider(
      <Reroute
        modification={{
          ...mockModification,
          segmentSpeeds: []
        }}
        setMapState={jest.fn()}
        update={jest.fn()}
      />
    )
    mock.wrapper.unmount()
  })
})
