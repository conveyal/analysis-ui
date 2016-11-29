/* global describe, it, expect */

import renderer from 'react-test-renderer'
import React from 'react'

import Icon from '../icon'

describe('Component > Icon', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <Icon
        type='pencil'
        className='test'
        />
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
