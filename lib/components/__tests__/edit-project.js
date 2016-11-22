/* global describe, it, expect, jest */

import { mount } from 'enzyme'
import { mountToJson } from 'enzyme-to-json'
import React from 'react'

import EditProject from '../edit-project'

describe('Component > EditProject', () => {
  it('renders correctly', () => {
    const props = {
      addComponentToMap: jest.fn(),
      bounds: {
        north: 1,
        east: 2,
        south: 3,
        west: 4
      },
      description: 'A test scenario',
      id: '1',
      name: 'Test Scenario',
      r5Version: '1 billion',
      removeComponentFromMap: jest.fn(),
      save: jest.fn(),
      load: jest.fn(),
      setLocally: jest.fn(),
      setCenter: jest.fn()
    }

    // mount component
    const tree = mount(
      <EditProject
        {...props}
        />
    )
    expect(mountToJson(tree)).toMatchSnapshot()
    expect(props['addComponentToMap']).toBeCalled()
    const noCalls = [
      'removeComponentFromMap',
      'save',
      'load',
      'setLocally',
      'setCenter'
    ]
    noCalls.forEach((fn) => {
      expect(props[fn]).not.toBeCalled()
    })
  })
})
