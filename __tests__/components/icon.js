/* global describe, it, expect */

import React from 'react'
import renderer from 'react-test-renderer'

import Icon from '../../lib/components/icon'

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
