/* global describe, it, expect */

import { mount } from 'enzyme'
import { mountToJson } from 'enzyme-to-json'
import React from 'react'

import R5Version from '../r5-version'

describe('Component > R5Version', () => {
  it('renders correctly', () => {
    const props = {}

    // mount component
    const tree = mount(
      <R5Version
        {...props}
        />
    )
    expect(mountToJson(tree)).toMatchSnapshot()
  })
})
