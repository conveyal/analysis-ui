/* global describe, it, expect */

import renderer from 'react-test-renderer'
import React from 'react'

import Distance from '../distance'

describe('Report > Distance', () => {
  it('renders correctly', () => {
    const props = {
      km: 2
    }

    // mount component
    const tree = renderer.create(<Distance {...props} />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
