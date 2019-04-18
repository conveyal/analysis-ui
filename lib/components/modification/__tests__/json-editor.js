import enzyme from 'enzyme'
import React from 'react'

import JSONEditor from '../json-editor'

describe('Components > Modification > JSON Editor', () => {
  it('should render', () => {
    const save = jest.fn()
    const modification = {name: 'hello'}
    const wrapper = enzyme.mount(
      <JSONEditor save={save} modification={modification} />
    )
    expect(wrapper).toMatchSnapshot()

    window.alert = jest.fn()
    wrapper
      .find('Button')
      .simulate('click')
    expect(window.alert).not.toHaveBeenCalled()
    expect(save.mock.calls).toHaveLength(1)
  })
})
