/* global describe, it, expect */

import { mount } from 'enzyme'
import { mountToJson } from 'enzyme-to-json'
import React from 'react'

import Icon from '../../lib/components/icon'

describe('Component > Icon', () => {
  it('renders correctly', () => {
    const tree = mount(
      <Icon
        type='pencil'
        className='test'
        />
    )
    expect(mountToJson(tree)).toMatchSnapshot()
  })
})
