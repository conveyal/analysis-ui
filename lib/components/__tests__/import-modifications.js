/* global describe, it, expect, jest */

import renderer from 'react-test-renderer'
import React from 'react'

import ImportModifications from '../import-modifications'

describe('Component > ImportModifications', () => {
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
