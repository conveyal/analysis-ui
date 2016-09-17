/* global describe, it, expect */

import React from 'react'
import renderer from 'react-test-renderer'

import { Group, Button } from '../../lib/components/buttons'

describe('Button', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <Button
        style='fabulous'
        block
        size='sm'
        className='some-class'
        target='_blank'
        />
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })
})

describe('Group', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <Group justified />
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
