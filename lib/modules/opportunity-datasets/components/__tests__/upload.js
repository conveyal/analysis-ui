import {testComponent} from 'lib/utils/component'

import Upload from '../upload'

test('upload should render without errors', () => {
  const p = testComponent(Upload)
  expect(p.mount()).toMatchSnapshot()
})
