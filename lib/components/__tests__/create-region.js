import {testComponent} from 'lib/utils/component'

import CreateRegion from '../create-region'

test('create-region.render', () => {
  const p = testComponent(CreateRegion, {setMapChildren: jest.fn})
  expect(p.mount()).toMatchSnapshot()
})
