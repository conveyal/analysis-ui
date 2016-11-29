/* global describe, it, expect */

import renderer from 'react-test-renderer'
import React from 'react'

import Login from '../login'

describe('Component > Icon', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <Login />
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
