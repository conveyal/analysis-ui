/* global describe, it, expect, jest */

import React from 'react'
import renderer from 'react-test-renderer'

import { mockComponents } from '../../testUtils'

jest.mock('react-select', () => 'React-Select')
jest.mock('../../lib/components/buttons', () => { return mockComponents(['Button']) })
jest.mock('../../lib/components/panel', () => { return mockComponents(['Panel', 'Heading', 'Body']) })

import ImportModifications from '../../lib/components/import-modifications'

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
