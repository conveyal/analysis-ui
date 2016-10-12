/* global describe, it, expect, jest */

import { mount } from 'enzyme'
import { mountToJson } from 'enzyme-to-json'
import React from 'react'

import EditScenario from '../../lib/components/edit-scenario'

describe('Component > EditScenario', () => {
  it('renders correctly', () => {
    const mockBundles = [{ id: 1, name: 'B1' }, { id: 2, name: 'B2' }]
    const closeFn = jest.fn()
    const createFn = jest.fn()
    const deleteScenarioFn = jest.fn()
    const saveFn = jest.fn()
    const tree = mount(
      <EditScenario
        bundles={mockBundles}
        close={closeFn}
        create={createFn}
        deleteScenario={deleteScenarioFn}
        isEditing={false}
        name='Mock Scenario'
        projectId='P1'
        variants={[]}
        save={saveFn}
        />
    )
    expect(mountToJson(tree)).toMatchSnapshot()
    expect(closeFn).not.toBeCalled()
    expect(createFn).not.toBeCalled()
    expect(deleteScenarioFn).not.toBeCalled()
    expect(saveFn).not.toBeCalled()
  })
})
