/* global describe, it, expect, jest */

import renderer from 'react-test-renderer'
import React from 'react'

import EditBundle from '../edit-bundle'

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
    const tree = renderer.create(
      <EditBundle
        {...props}
        />
    ).toJSON()
    expect(tree).toMatchSnapshot()
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
