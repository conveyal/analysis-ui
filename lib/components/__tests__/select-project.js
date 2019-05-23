import {testComponent} from 'lib/utils/test'
import {mockBundle, mockProject, mockRegion} from 'lib/utils/mock-data'

import SelectProject from '../select-project'

test('Component > SelectProject', () => {
  const props = {
    bundles: [mockBundle],
    region: mockRegion,
    projects: [mockProject]
  }
  const c = testComponent(SelectProject, props)
  expect(c.mount()).toMatchSnapshot()
})
