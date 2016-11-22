/* global describe, it, expect, jest */

import { mount } from 'enzyme'
import { mountToJson } from 'enzyme-to-json'
import React from 'react'

import SelectPatterns from '../select-patterns'

describe('Component > SelectPatterns', () => {
  it('renders correctly', () => {
    const onChangeFn = jest.fn()
    const routePatterns = [
      {
        pattern_id: 1,
        name: 'mock pattern',
        trips: []
      }
    ]
    const tree = mount(
      <SelectPatterns
        onChange={onChangeFn}
        routePatterns={routePatterns}
        />
    )
    expect(mountToJson(tree)).toMatchSnapshot()
    expect(onChangeFn).not.toBeCalled()
  })
})
