/* global describe, it, expect, jest */

describe('Component > ImportModifications', () => {
  const renderer = require('react-test-renderer')
  const React = require('react')
  const ImportModifications = require('../import-modifications')

  it('renders correctly', () => {
    const copyFromScenarioFn = jest.fn()
    const tree = renderer.create(
      <ImportModifications
        copyFromScenario={copyFromScenarioFn}
        toScenarioId='1'
        variants={[]}
        />
    ).toJSON()
    expect(tree).toMatchSnapshot()
    expect(copyFromScenarioFn).not.toBeCalled()
  })
})
