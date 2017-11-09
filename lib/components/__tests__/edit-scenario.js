// @flow

import renderer from 'react-test-renderer'
import React from 'react'

import EditScenario from '../edit-scenario'

describe('Component > EditScenario', () => {
  it('renders correctly', () => {
    const mockBundles = [{_id: 1, name: 'B1'}, {_id: 2, name: 'B2'}]
    const closeFn = jest.fn()
    const createFn = jest.fn()
    const deleteScenarioFn = jest.fn()
    const saveFn = jest.fn()
    const tree = renderer
      .create(
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
      .toJSON()
    expect(tree).toMatchSnapshot()
    expect(closeFn).not.toBeCalled()
    expect(createFn).not.toBeCalled()
    expect(deleteScenarioFn).not.toBeCalled()
    expect(saveFn).not.toBeCalled()
  })
})
