/* global describe, it, expect, jest */

import React from 'react'
import renderer from 'react-test-renderer'

import { mockComponents } from '../../test-utils'

jest.mock('react-select', () => 'React-Select')
jest.mock('../../lib/components/buttons', () => { return mockComponents(['Button']) })
jest.mock('../../lib/components/input', () => { return mockComponents(['Group']) })
jest.mock('../../lib/components/panel', () => { return mockComponents(['Body']) })

import SelectScenario from '../../lib/components/select-scenario'

describe('Component > SelectScenario', () => {
  it('renders correctly', () => {
    const mockScenarios = [{ id: 1, name: 'S1' }, { id: 2, name: 'S2' }]
    const pushFn = jest.fn()
    const tree = renderer.create(
      <SelectScenario
        projectId='P1'
        push={pushFn}
        scenarios={mockScenarios}
        />
    ).toJSON()
    expect(tree).toMatchSnapshot()
    expect(pushFn).not.toBeCalled()
  })
})
