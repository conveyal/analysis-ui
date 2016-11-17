/* global describe, it, expect */

import { mount } from 'enzyme'
import { mountToJson } from 'enzyme-to-json'
import React from 'react'

import Distance from '../distance'

describe('Report > Distance', () => {
  it('renders correctly', () => {
    const props = {
      km: 2
    }

    // mount component
    const tree = mount(
      <Distance
        {...props}
        />
      , {
        attachTo: document.getElementById('test')
      }
    )
    expect(mountToJson(tree)).toMatchSnapshot()
  })
})
