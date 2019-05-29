import {testComponent} from 'lib/utils/test'
import {mockProject} from 'lib/utils/mock-data'

import ImportModifications from '../import-modifications'

describe('Component > ImportModifications', () => {
  it('renders correctly', () => {
    const c = testComponent(ImportModifications, {
      projects: [mockProject],
      projectId: '1',
      regionId: '1'
    })
    const wrapper = c.mount()
    expect(wrapper).toMatchSnapshot()
  })
})
