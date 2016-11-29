/* global describe, it, expect, jest */

import renderer from 'react-test-renderer'
import React from 'react'

import VariantEditor from '../variant-editor'

describe('Component > VariantEditor', () => {
  it('renders correctly', () => {
    const props = {
      createVariant: jest.fn(),
      currentScenario: {},
      modifications: [],
      saveScenario: jest.fn(),
      scenarioName: 'Test Scenario',
      showVariant: jest.fn(),
      updateVariant: jest.fn(),
      variants: [],
      scenarioId: '1',
      projectId: '1'
    }

    // mount component
    const tree = renderer.create(
      <VariantEditor
        {...props}
        />
    ).toJSON()
    expect(tree).toMatchSnapshot()
    const noCalls = [
      'createVariant',
      'saveScenario',
      'showVariant',
      'updateVariant'
    ]
    noCalls.forEach((fn) => {
      expect(props[fn]).not.toBeCalled()
    })
  })
})
