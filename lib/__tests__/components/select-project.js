/* global describe, it, expect, jest */

import { mount } from 'enzyme'
import { mountToJson } from 'enzyme-to-json'
import React from 'react'

import SelectProject from '../../lib/components/select-project'

describe('Component > SelectProject', () => {
  it('renders correctly', () => {
    const createFn = jest.fn()
    const mockProjects = [{ id: 1, name: 'P1' }, { id: 2, name: 'P2' }]
    const pushFn = jest.fn()
    const tree = mount(
      <SelectProject
        create={createFn}
        projects={mockProjects}
        push={pushFn}
        />
    )
    expect(mountToJson(tree)).toMatchSnapshot()
    expect(createFn).not.toBeCalled()
    expect(pushFn).not.toBeCalled()
  })
})
