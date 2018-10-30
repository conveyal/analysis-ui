// @flow
import React from 'react'
import {mount} from 'enzyme'

import DatePicker from '../date-picker'

describe('Components > DatePicker', () => {
  it('should render a DatePicker properly', () => {
    const tree = mount(<DatePicker
      onChange={jest.fn()}
      value='Tue Oct 23 2018 21:02:36 GMT+0800'
    />)

    expect(tree.find('input').prop('value')).toBe('10/23/2018')
  })
})
