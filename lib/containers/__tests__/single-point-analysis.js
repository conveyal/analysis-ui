import {testComponent} from 'lib/utils/component'

import Analysis from '../single-point-analysis'

test('constainers/single-point-analysis', function () {
  const p = testComponent(Analysis, {setMapChildren: jest.fn()})
  const wrapper = p.mount()
  expect(wrapper.find(Analysis)).toMatchSnapshot()

  // Test unmounting the compoennt also
  wrapper.unmount()
})
