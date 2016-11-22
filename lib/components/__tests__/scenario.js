/* global describe, it, expect, jest */

import { mount } from 'enzyme'
import { mountToJson } from 'enzyme-to-json'
import React from 'react'

import Scenario from '../scenario'

describe('Component > Scenario', () => {
  it('renders correctly', () => {
    const addComponentToMapFn = jest.fn()
    const loadFn = jest.fn()
    const tree = mount(
      <Scenario
        addComponentToMap={addComponentToMapFn}
        id='1234'
        isLoaded={false}
        load={loadFn}
        name='Test'
        projectId='Test1234'
        >
        Scenario content
      </Scenario>
    )
    expect(mountToJson(tree)).toMatchSnapshot()
    expect(addComponentToMapFn).not.toBeCalled()
    expect(loadFn).toBeCalled()
  })
})
