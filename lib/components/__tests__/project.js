/* global describe, it, expect, jest */

import { mount } from 'enzyme'
import { mountToJson } from 'enzyme-to-json'
import React from 'react'

import Project from '../project'

describe('Component > Project', () => {
  it('renders correctly', () => {
    const loadFn = jest.fn()
    const tree = mount(
      <Project
        description='A test project'
        id='1234'
        isLoaded={false}
        load={loadFn}
        name='Test'
        >
        Project content
      </Project>
    )
    expect(mountToJson(tree)).toMatchSnapshot()
    expect(loadFn).toBeCalled()
  })
})
