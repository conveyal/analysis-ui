// @flow
import enzyme from 'enzyme'
import React from 'react'

import DaysOfService from '../days-of-service'

describe('Report > DaysOfService', () => {
  it('renders correctly', () => {
    const props = {
      monday: true,
      tuesday: true
    }

    const tree = enzyme.shallow(<DaysOfService {...props} />)
    expect(tree).toMatchSnapshot()
  })
})
