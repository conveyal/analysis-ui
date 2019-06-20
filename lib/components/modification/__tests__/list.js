import {testComponent} from 'lib/utils/component'

import ModificationsList from '../list'

test('Modification > List', () => {
  const c = testComponent(ModificationsList, {setMapChildren: jest.fn()})
  c.router.query = {
    projectId: '1'
  }
  expect(c.mount()).toMatchSnapshot()
})
