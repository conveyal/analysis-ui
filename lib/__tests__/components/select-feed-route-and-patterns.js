/* global describe, it, expect, jest */

import { mount } from 'enzyme'
import { mountToJson } from 'enzyme-to-json'
import React from 'react'

import SelectFeedRouteAndPatterns from '../../lib/components/select-feed-route-and-patterns'

describe('Component > SelectFeedRouteAndPatterns', () => {
  it('renders correctly', () => {
    const onChangeFn = jest.fn()
    const tree = mount(
      <SelectFeedRouteAndPatterns
        feeds={[]}
        onChange={onChangeFn}
        routes={[]}
        />
    )
    expect(mountToJson(tree)).toMatchSnapshot()
    expect(onChangeFn).not.toBeCalled()
  })
})
