import {mockBundle, mockProject} from 'lib/utils/mock-data'
import {testComponent} from 'lib/utils/component'

import EditProject from '../edit-project'

test('Component > EditProject', () => {
  const props = {
    bundleName: mockBundle.name,
    project: mockProject
  }

  const c = testComponent(EditProject, props)
  expect(c.mount()).toMatchSnapshot()
})
