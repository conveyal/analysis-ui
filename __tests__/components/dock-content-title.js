/* global describe, it, expect */

import { mount } from 'enzyme'
import { mountToJson } from 'enzyme-to-json'
import React from 'react'

import Title from '../../lib/components/dock-content-title'

describe('Component > Title', () => {
  it('renders correctly', () => {
    const tree = mount(
      <Title>Title text</Title>
    )
    expect(mountToJson(tree)).toMatchSnapshot()
  })
})
