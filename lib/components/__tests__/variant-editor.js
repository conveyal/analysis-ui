/* global describe, it, expect, jest */

describe('Component > VariantEditor', () => {
  const renderer = require('react-test-renderer')
  const React = require('react')
  const VariantEditor = require('../variant-editor')

  it('renders correctly', () => {
    const props = {
      analyzeVariant: jest.fn(),
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
