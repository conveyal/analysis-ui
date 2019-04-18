// @flow
import enzyme from 'enzyme'
import React from 'react'

import {mockProject} from '../../utils/mock-data'
import ImportModifications from '../import-modifications'

describe('Component > ImportModifications', () => {
  it('renders correctly', () => {
    const copyFromProjectFn = jest.fn()
    const pushFn = jest.fn()
    const wrapper = enzyme.shallow(
      <ImportModifications
        projects={[mockProject]}
        copyFromProject={copyFromProjectFn}
        toProjectId='1'
        regionId='1'
        push={pushFn}
        variants={[]}
      />
    )
    expect(wrapper).toMatchSnapshot()
    expect(copyFromProjectFn).not.toHaveBeenCalled()
    expect(pushFn).not.toHaveBeenCalled()

    wrapper.setState({importProjectId: 1})
    wrapper.find('Button').at(0)
      .dive()
      .find('a')
      .simulate('click')
    expect(pushFn).toHaveBeenCalled()

    wrapper.find('Button').at(1)
      .dive()
      .find('a')
      .simulate('click')
    expect(copyFromProjectFn).toHaveBeenCalled()
  })
})
