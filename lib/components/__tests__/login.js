/* global describe, it, expect */

import { mount } from 'enzyme'
import { mountToJson } from 'enzyme-to-json'
import React from 'react'

import Login from '../login'

describe('Component > Icon', () => {
  it('renders correctly', () => {
    const tree = mount(
      <Login />
    )
    expect(mountToJson(tree)).toMatchSnapshot()
  })
})
