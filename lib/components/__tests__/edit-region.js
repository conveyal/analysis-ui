import {testComponent} from 'lib/utils/test'
import {mockRegion} from 'lib/utils/mock-data'

import EditRegion from '../edit-region'

test('Component > EditRegion', () => {
  const props = {
    region: mockRegion
  }

  // mount component
  const c = testComponent(EditRegion, props)
  const tree = c.mount()
  expect(tree).toMatchSnapshot()
})
