/* global describe, it, expect */

import { mount } from 'enzyme'
import { mountToJson } from 'enzyme-to-json'
import React from 'react'

import Speed from '../speed'

describe('Report > Speed', () => {
  it('renders correctly', () => {
    const props = {
      kmh: 2000
    }

    // mount component
    const tree = mount(
      <Speed
        {...props}
        />
      , {
        attachTo: document.getElementById('test')
      }
    )
    expect(mountToJson(tree)).toMatchSnapshot()
  })
})
