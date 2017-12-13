// @flow

import renderer from 'react-test-renderer'
import React from 'react'

import DaysOfService from '../days-of-service'

describe('Report > DaysOfService', () => {
  it('renders correctly', () => {
    const props = {
      monday: true,
      tuesday: true
    }

    // mount component
    const tree = renderer.create(<DaysOfService {...props} />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
