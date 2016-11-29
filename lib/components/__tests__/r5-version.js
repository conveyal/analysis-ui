/* global describe, it, expect */

import renderer from 'react-test-renderer'
import React from 'react'

import R5Version from '../r5-version'

describe('Component > R5Version', () => {
  it('renders correctly', () => {
    const props = {}

    // mount component
    const tree = renderer.create(
      <R5Version
        {...props}
        />
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
