/* global describe, it, expect, jest */

import React from 'react'
import renderer from 'react-test-renderer'

import { mockComponents } from '../../testUtils'

jest.mock('react-select', () => 'React-Select')
jest.mock('../../lib/components/buttons', () => { return mockComponents(['Button']) })
jest.mock('../../lib/components/input', () => { return mockComponents(['Group', 'Text']) })
jest.mock('../../lib/components/icon', () => 'Icon')
jest.mock('../../lib/components/panel', () => { return mockComponents(['Body', 'Heading', 'Panel']) })

import EditScenario from '../../lib/components/edit-scenario'

describe('Component > EditScenario', () => {
  it('renders correctly', () => {
    const mockBundles = [{ id: 1, name: 'B1' }, { id: 2, name: 'B2' }]
    const closeFn = jest.fn()
    const createFn = jest.fn()
    const deleteScenarioFn = jest.fn()
    const saveFn = jest.fn()
    const tree = renderer.create(
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
    ).toJSON()
    expect(tree).toMatchSnapshot()
    expect(closeFn).not.toBeCalled()
    expect(createFn).not.toBeCalled()
    expect(deleteScenarioFn).not.toBeCalled()
    expect(saveFn).not.toBeCalled()
  })
})
