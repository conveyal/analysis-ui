/* global describe, it, expect, jest */

import renderer from 'react-test-renderer'
import React from 'react'

import SelectFeedRouteAndPatterns from '../select-feed-route-and-patterns'

describe('Component > SelectFeedRouteAndPatterns', () => {
  it('renders correctly', () => {
    const onChangeFn = jest.fn()
    const tree = renderer.create(
      <SelectFeedRouteAndPatterns
        feeds={[]}
        onChange={onChangeFn}
        routes={[]}
        />
    ).toJSON()
    expect(tree).toMatchSnapshot()
    expect(onChangeFn).not.toBeCalled()
  })
})
