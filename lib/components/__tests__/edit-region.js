import {testComponent} from 'lib/utils/component'
import {mockRegion} from 'lib/utils/mock-data'

import EditRegion from '../edit-region'

test('Component > EditRegion', () => {
  const props = {
    region: mockRegion,
    setMapChildren: jest.fn()
  }

  // mount component
  const c = testComponent(EditRegion, props)
  const tree = c.mount()
  expect(tree).toMatchSnapshot()
})
