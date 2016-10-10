/* global describe, it, expect, jest */

import { mount } from 'enzyme'
import { mountToJson } from 'enzyme-to-json'
import React from 'react'

import SelectFeedAndRoutes from '../../lib/components/select-feed-and-routes'

describe('Component > SelectFeedAndRoutes', () => {
  it('renders correctly', () => {
    const feeds = [{ id: 1 }, { id: 2 }]
    const onChangeFn = jest.fn()
    const tree = mount(
      <SelectFeedAndRoutes
        feeds={feeds}
        onChange={onChangeFn}
        />
    )
    expect(mountToJson(tree)).toMatchSnapshot()
    expect(onChangeFn).not.toBeCalled()
  })
})
