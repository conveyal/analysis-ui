/* global describe, it, expect, jest */

import { mount } from 'enzyme'
import { mountToJson } from 'enzyme-to-json'
import React from 'react'

import ImportModifications from '../../lib/components/import-modifications'

describe('Component > ImportModifications', () => {
  it('renders correctly', () => {
    const copyFromScenarioFn = jest.fn()
    const tree = mount(
      <ImportModifications
        copyFromScenario={copyFromScenarioFn}
        toScenarioId='1'
        variants={[]}
        />
    )
    expect(mountToJson(tree)).toMatchSnapshot()
    expect(copyFromScenarioFn).not.toBeCalled()
  })
})
