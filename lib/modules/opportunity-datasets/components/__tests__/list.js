import {testComponent} from 'lib/utils/component'

import List from '../list'

describe('Opportunity Datasets > Components > List', () => {
  it('should render without errors', () => {
    const p = testComponent(List)
    expect(p.mount()).toMatchSnapshot()
  })
})
