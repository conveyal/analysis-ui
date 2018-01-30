// @flow

import renderer from 'react-test-renderer'
import React from 'react'

import SelectRegion from '../select-region'
import {mockRegion} from '../../utils/mock-data'

describe('Component > SelectRegion', () => {
  it('renders correctly', () => {
    const clearCurrentRegion = jest.fn()
    const mockRegions = [mockRegion]
    const loadAllRegions = jest.fn()
    const tree = renderer
      .create(
        <SelectRegion
          clearCurrentRegion={clearCurrentRegion}
          loadAllRegions={loadAllRegions}
          regions={mockRegions}
        />
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
    expect(loadAllRegions).toBeCalled()
    expect(clearCurrentRegion).toBeCalled()
  })
})
