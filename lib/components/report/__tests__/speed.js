// @flow

import renderer from 'react-test-renderer'
import React from 'react'

import Speed from '../speed'

describe('Report > Speed', () => {
  it('renders correctly', () => {
    const props = {
      kmh: 2000
    }

    // mount component
    const tree = renderer.create(<Speed {...props} />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
