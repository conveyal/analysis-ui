import {testComponent} from 'lib/utils/component'

import ImportShapefile from '../import-shapefile'

test('Component > ImportShapefile', () => {
  const props = {
    variants: [],
    projectId: '1',
    regionId: '1'
  }

  // mount component
  const c = testComponent(ImportShapefile, props)
  const tree = c.mount()
  expect(tree).toMatchSnapshot()
})
