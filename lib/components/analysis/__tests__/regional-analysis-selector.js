import {mockRegionalAnalyses} from 'lib/utils/mock-data'
import {testComponent} from 'lib/utils/component'

import Regional from '../regional-analysis-selector'

describe('Components > Analysis > Regional Analysis Selector', () => {
  it('renders correctly', () => {
    const p = testComponent(Regional, {allAnalyses: mockRegionalAnalyses})
    expect(p.mount()).toMatchSnapshot()
  })
})
