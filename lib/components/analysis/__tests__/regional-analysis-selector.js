// @flow
import enzyme from 'enzyme'
import React from 'react'

import Regional from '../regional-analysis-selector'
import {mockRegionalAnalyses} from '../../../utils/mock-data'

describe('Components > Analysis > Regional Analysis Selector', () => {
  it('renders correctly', () => {
    const tree = enzyme.shallow(
      <Regional
        allAnalyses={mockRegionalAnalyses}
        deleteAnalysis={jest.fn()}
        goToAnalysis={jest.fn()}
      />
    )
    expect(tree).toMatchSnapshot()
    tree.unmount()
  })
})
