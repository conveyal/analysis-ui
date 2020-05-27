import {testComponent} from 'lib/utils/component'

import Title from '../title'

describe('Components > Analysis > Title', () => {
  it('should render properly', () => {
    const wrapper = testComponent(Title).mount()
    expect(wrapper.find('Button')).toHaveLength(2)
    expect(wrapper.find('Button').at(0).props().isDisabled).toEqual(true)
    expect(wrapper.find('Button').at(1).props().isDisabled).toEqual(false)
    expect(wrapper).toMatchSnapshot()
  })
})
