/* global describe, it, expect, jest */

import renderer from 'react-test-renderer'
import React from 'react'

import SelectFeedAndRoutes from '../select-feed-and-routes'

describe('Component > SelectFeedAndRoutes', () => {
  it('renders correctly', () => {
    const feeds = [{ id: 1 }, { id: 2 }]
    const onChangeFn = jest.fn()
    const tree = renderer.create(
      <SelectFeedAndRoutes
        feeds={feeds}
        onChange={onChangeFn}
        />
    ).toJSON()
    expect(tree).toMatchSnapshot()
    expect(onChangeFn).not.toBeCalled()
  })
})
