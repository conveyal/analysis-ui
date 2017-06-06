/* global describe, it, expect, jest */

describe('Component > ImportModifications', () => {
  const React = require('react')
  const ImportModifications = require('../import-modifications')
  const {mount} = require('enzyme')
  const {mountToJson} = require('enzyme-to-json')

  it('renders correctly', () => {
    const copyFromScenarioFn = jest.fn()
    const tree = mount(
      <ImportModifications
        candidateScenarioOptions={[{label: 'Scenario 1', value: 'scenario-1-id'}]}
        copyFromScenario={copyFromScenarioFn}
        toScenarioId='1'
        variants={[]}
        />
    )
    expect(mountToJson(tree)).toMatchSnapshot()
    expect(copyFromScenarioFn).not.toBeCalled()

    tree.find('.Select-control').simulate('keyDown', { keyCode: 40 })
    tree.find('.Select-control').simulate('keyDown', { keyCode: 13 })
    tree.find('.btn').simulate('click')

    expect(copyFromScenarioFn).toBeCalled()
  })
})
