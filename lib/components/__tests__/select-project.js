// @flow

import renderer from 'react-test-renderer'
import React from 'react'

import SelectProject from '../select-project'

describe('Component > SelectProject', () => {
  it('renders correctly', () => {
    const createFn = jest.fn()
    const mockProjects = [{_id: '1', name: 'P1'}, {_id: '2', name: 'P2'}]
    const pushFn = jest.fn()
    const loadAllProjects = jest.fn()
    const tree = renderer
      .create(
        <SelectProject
          create={createFn}
          loadAllProjects={loadAllProjects}
          projects={mockProjects}
          push={pushFn}
        />
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
    expect(createFn).not.toBeCalled()
    expect(pushFn).not.toBeCalled()
    expect(loadAllProjects).toBeCalled()
  })
})
