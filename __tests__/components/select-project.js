/* global describe, it, expect, jest */

import React from 'react'
import renderer from 'react-test-renderer'

import { mockComponents } from '../../test-utils'

jest.mock('react-select', () => 'React-Select')
jest.mock('../../lib/components/buttons', () => { return mockComponents(['Button']) })
jest.mock('../../lib/components/input', () => { return mockComponents(['Group']) })
jest.mock('../../lib/components/panel', () => { return mockComponents(['Body']) })

import SelectProject from '../../lib/components/select-project'

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
