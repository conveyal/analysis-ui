/* global describe, it, expect, jest */

import React from 'react'
import renderer from 'react-test-renderer'

jest.mock('../../lib/components/select-patterns', () => 'SelectPatterns')
jest.mock('../../lib/components/select-feed-and-routes', () => 'SelectFeedAndRoutes')

import SelectFeedRouteAndPatterns from '../../lib/components/select-feed-route-and-patterns'

describe('SelectFeedRouteAndPatterns', () => {
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
