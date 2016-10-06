/* global describe, it, expect */

import React from 'react'
import renderer from 'react-test-renderer'

import Title from '../../lib/components/dock-content-title'

describe('Component > Title', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <Title>Title text</Title>
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
