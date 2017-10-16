/* global describe, it, expect, jest */

describe('Component > VariantEditor', () => {
  const renderer = require('react-test-renderer')
  const React = require('react')
  const VariantEditor = require('../variant-editor')

  it('renders correctly', () => {
    const props = {
      variants: [],
      createVariant: jest.fn(),
      deleteVariant: jest.fn(),
      editVariantName: jest.fn(),
      showVariant: jest.fn()
    }

    // mount component
    const tree = renderer.create(<VariantEditor {...props} />).toJSON()
    expect(tree).toMatchSnapshot()
    const noCalls = [
      'createVariant',
      'deleteVariant',
      'editVariantName',
      'showVariant'
    ]
    noCalls.forEach(fn => {
      expect(props[fn]).not.toBeCalled()
    })
  })
})
