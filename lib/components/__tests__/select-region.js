// @flow

import renderer from 'react-test-renderer'
import React from 'react'

import SelectRegion from '../select-region'
import {mockRegion} from '../../utils/mock-data'

describe('Component > SelectRegion', () => {
  it('renders correctly', () => {
    const clearCurrentRegion = jest.fn()
    const createFn = jest.fn()
    const mockRegions = [mockRegion]
    const pushFn = jest.fn()
    const loadAllRegions = jest.fn()
    const tree = renderer
      .create(
        <SelectRegion
          create={createFn}
          clearCurrentRegion={clearCurrentRegion}
          loadAllRegions={loadAllRegions}
          regions={mockRegions}
          push={pushFn}
        />
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
    expect(createFn).not.toBeCalled()
    expect(pushFn).not.toBeCalled()
    expect(loadAllRegions).toBeCalled()
    expect(clearCurrentRegion).toBeCalled()
  })
})
