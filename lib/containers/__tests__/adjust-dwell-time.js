import React from 'react'

import {mockWithProvider, mockModification} from '../../utils/mock-data'
import AdjustDwellTime from '../adjust-dwell-time'

describe('Containers > AdjustDwellTime', () => {
  it('should render without errors', () => {
    const mock = mockWithProvider(
      <AdjustDwellTime modification={mockModification} />
    )
    mock.wrapper.unmount()
  })
})
