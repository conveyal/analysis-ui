import {testComponent} from 'lib/utils/component'

import Analysis from '../single-point-analysis'

describe('Containers > Single Point', function() {
  it('should render correctly', async function() {
    const p = testComponent(Analysis)
    const wrapper = p.mount()
    expect(wrapper.find(Analysis)).toMatchSnapshot()

    // Test unmounting the compoennt also
    wrapper.unmount()
  })
})
