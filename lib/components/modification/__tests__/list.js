import {testComponent} from 'lib/utils/test'

import ModificationsList from '../list'

test('Modification > List', () => {
  const c = testComponent(ModificationsList)
  c.router.query = {
    projectId: '1'
  }
  expect(c.mount()).toMatchSnapshot()
})
