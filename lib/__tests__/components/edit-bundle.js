/* global describe, it, expect, jest */

import { mount } from 'enzyme'
import { mountToJson } from 'enzyme-to-json'
import React from 'react'

import EditBundle from '../../lib/components/edit-bundle'

describe('Component > EditBundle', () => {
  it('renders correctly', () => {
    const props = {
      addBundle: jest.fn(),
      bundle: {},
      bundleId: '1',
      deleteBundle: jest.fn(),
      name: 'Test Bundle',
      projectId: '1',
      saveBundle: jest.fn()
    }

    // mount component
    const tree = mount(
      <EditBundle
        {...props}
        />
    )
    expect(mountToJson(tree)).toMatchSnapshot()
    const noCalls = [
      'addBundle',
      'deleteBundle',
      'saveBundle'
    ]
    noCalls.forEach((fn) => {
      expect(props[fn]).not.toBeCalled()
    })
  })
})
