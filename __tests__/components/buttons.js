/* global describe, it, expect */

import { mount } from 'enzyme'
import { mountToJson } from 'enzyme-to-json'
import React from 'react'

import { Group, Button } from '../../lib/components/buttons'

describe('Component > Button', () => {
  it('renders correctly', () => {
    const tree = mount(
      <Button
        style='fabulous'
        block
        size='sm'
        className='some-class'
        target='_blank'
        />
    )
    expect(mountToJson(tree)).toMatchSnapshot()
  })
})

describe('Component > Group', () => {
  it('renders correctly', () => {
    const tree = mount(
      <Group justified />
    )
    expect(mountToJson(tree)).toMatchSnapshot()
  })
})
