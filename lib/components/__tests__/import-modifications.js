// @flow
import React from 'react'

import {mockWithProvider, mockProject} from '../../utils/mock-data'
import ImportModifications from '../import-modifications'

describe('Component > ImportModifications', () => {
  it('renders correctly', () => {
    const copyFromProjectFn = jest.fn()
    const pushFn = jest.fn()
    const {snapshot, wrapper} = mockWithProvider(
      <ImportModifications
        projects={[mockProject]}
        copyFromProject={copyFromProjectFn}
        toProjectId='1'
        regionId='1'
        push={pushFn}
        variants={[]}
      />
    )
    expect(snapshot()).toMatchSnapshot()
    expect(copyFromProjectFn).not.toHaveBeenCalled()
    expect(pushFn).not.toHaveBeenCalled()

    wrapper.find('.Select-control').simulate('keyDown', {keyCode: 40})
    wrapper.find('.Select-control').simulate('keyDown', {keyCode: 13})

    wrapper.find('.fa-copy').simulate('click')
    expect(copyFromProjectFn).toHaveBeenCalled()

    wrapper.find('.fa-upload').simulate('click')
    expect(pushFn).toHaveBeenCalled()
  })
})
