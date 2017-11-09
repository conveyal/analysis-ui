// @flow

import React from 'react'
import {mount} from 'enzyme'
import {mountToJson} from 'enzyme-to-json'

import ImportModifications from '../import-modifications'

describe('Component > ImportModifications', () => {
  it('renders correctly', () => {
    const copyFromScenarioFn = jest.fn()
    const tree = mount(
      <ImportModifications
        candidateScenarioOptions={[
          {label: 'Scenario 1', value: 'scenario-1-id'}
        ]}
        copyFromScenario={copyFromScenarioFn}
        toScenarioId='1'
        variants={[]}
      />
    )
    expect(mountToJson(tree)).toMatchSnapshot()
    expect(copyFromScenarioFn).not.toBeCalled()

    tree.find('.Select-control').simulate('keyDown', {keyCode: 40})
    tree.find('.Select-control').simulate('keyDown', {keyCode: 13})
    tree.find('.btn').simulate('click')

    expect(copyFromScenarioFn).toBeCalled()
  })
})
