import enzyme from 'enzyme'
import React from 'react'

import Icon from '../icon'

describe('Icon', () => {
  it('should match snapshot', () => {
    expect(
      enzyme.shallow(<Icon icon={{iconName: 'fake-icon'}} />)
    ).toMatchSnapshot()
  })
})
