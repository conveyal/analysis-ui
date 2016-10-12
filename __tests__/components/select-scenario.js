/* global describe, it, expect, jest */

import { mount } from 'enzyme'
import { mountToJson } from 'enzyme-to-json'
import React from 'react'

import SelectScenario from '../../lib/components/select-scenario'

describe('Component > SelectScenario', () => {
  it('renders correctly', () => {
    const mockScenarios = [{ id: 1, name: 'S1' }, { id: 2, name: 'S2' }]
    const pushFn = jest.fn()
    const tree = mount(
      <SelectScenario
        projectId='P1'
        push={pushFn}
        scenarios={mockScenarios}
        />
    )
    expect(mountToJson(tree)).toMatchSnapshot()
    expect(pushFn).not.toBeCalled()
  })
})
