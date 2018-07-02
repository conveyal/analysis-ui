// @flow
import React from 'react'

import {mockWithProvider} from '../../utils/mock-data'
import ImportModifications from '../import-modifications'

describe('Component > ImportModifications', () => {
  it('renders correctly', () => {
    const copyFromProjectFn = jest.fn()
    const pushFn = jest.fn()
    const {snapshot, wrapper} = mockWithProvider(
      <ImportModifications
        candidateProjectOptions={[
          {label: 'Project 1', value: 'project-1-id'}
        ]}
        copyFromProject={copyFromProjectFn}
        toProjectId='1'
        regionId='1'
        push = {pushFn}
        variants={[]}
      />
    )
    expect(snapshot()).toMatchSnapshot()
    expect(copyFromProjectFn).not.toBeCalled()
    expect(push).not.toBeCalled()

    wrapper.find('.Select-control').simulate('keyDown', {keyCode: 40})
    wrapper.find('.Select-control').simulate('keyDown', {keyCode: 13})
    wrapper.find('.btn').simulate('click')

    expect(copyFromProjectFn).toBeCalled()
  })
})
