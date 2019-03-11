// @flow

import renderer from 'react-test-renderer'
import React from 'react'

import VariantEditor from '../variant-editor'

describe('Component > VariantEditor', () => {
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
      expect(props[fn]).not.toHaveBeenCalled()
    })
  })
})
