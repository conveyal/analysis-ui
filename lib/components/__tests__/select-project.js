/* global describe, it, expect, jest */

import renderer from 'react-test-renderer'
import React from 'react'

import SelectProject from '../select-project'

describe('Component > SelectProject', () => {
  it('renders correctly', () => {
    const createFn = jest.fn()
    const mockProjects = [{ id: 1, name: 'P1' }, { id: 2, name: 'P2' }]
    const pushFn = jest.fn()
    const tree = renderer.create(
      <SelectProject
        create={createFn}
        projects={mockProjects}
        push={pushFn}
        />
    ).toJSON()
    expect(tree).toMatchSnapshot()
    expect(createFn).not.toBeCalled()
    expect(pushFn).not.toBeCalled()
  })
})
