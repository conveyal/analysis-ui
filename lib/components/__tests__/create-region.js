import {testComponent} from 'lib/utils/component'

import CreateRegion from '../create-region'

test('create-region.render', () => {
  const p = testComponent(CreateRegion)
  expect(p.mount()).toMatchSnapshot()
})
