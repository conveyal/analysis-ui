// @flow

import renderer from 'react-test-renderer'
import React from 'react'

import {mockFeed, mockPattern, mockRoute} from '../../../utils/mock-data'
import SelectFeedRouteAndPatterns from '../select-feed-route-and-patterns'

describe('Component > SelectFeedRouteAndPatterns', () => {
  it('renders empty correctly', () => {
    const onChangeFn = jest.fn()
    const tree = renderer
      .create(
        <SelectFeedRouteAndPatterns
          feeds={[]}
          onChange={onChangeFn}
          routePatterns={[]}
          routes={[]}
          selectedFeed={null}
          trips={[]}
        />
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
    expect(onChangeFn).not.toBeCalled()
  })

  it('renders filled correctly', () => {
    const onChangeFn = jest.fn()
    const tree = renderer
      .create(
        <SelectFeedRouteAndPatterns
          feeds={[mockFeed]}
          onChange={onChangeFn}
          routePatterns={[mockPattern]}
          routes={[mockRoute.route_id]}
          selectedFeed={mockFeed}
          trips={null}
        />
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
    expect(onChangeFn).not.toBeCalled()
  })
})
