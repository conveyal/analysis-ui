/* global describe, it, expect */

import { mount } from 'enzyme'
import { mountToJson } from 'enzyme-to-json'
import React from 'react'

import DaysOfService from '../../lib/report/days-of-service'

describe('Report > DaysOfService', () => {
  it('renders correctly', () => {
    const props = {
      monday: true,
      tuesday: true
    }

    // mount component
    const tree = mount(
      <DaysOfService
        {...props}
        />
      , {
        attachTo: document.getElementById('test')
      }
    )
    expect(mountToJson(tree)).toMatchSnapshot()
  })
})
