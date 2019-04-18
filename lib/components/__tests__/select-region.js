// @flow
import enzyme from 'enzyme'
import React from 'react'

import SelectRegion from '../select-region'
import {mockRegion} from '../../utils/mock-data'

describe('Component > SelectRegion', () => {
  it('renders correctly', () => {
    const clearCurrentRegion = jest.fn()
    const mockRegions = [mockRegion]
    const loadAllRegions = jest.fn()
    const tree = enzyme.shallow(
      <SelectRegion
        clearCurrentRegion={clearCurrentRegion}
        loadAllRegions={loadAllRegions}
        regions={mockRegions}
      />
    )
    expect(tree).toMatchSnapshot()
    expect(loadAllRegions).toHaveBeenCalled()
    expect(clearCurrentRegion).toHaveBeenCalled()
    tree.unmount()
  })
})
