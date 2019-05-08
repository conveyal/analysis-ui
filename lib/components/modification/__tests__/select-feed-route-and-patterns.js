//
import enzyme from 'enzyme'
import React from 'react'

import {mockFeed, mockPattern, mockRoute} from '../../../utils/mock-data'
import SelectFeedRouteAndPatterns from '../select-feed-route-and-patterns'

describe('Component > SelectFeedRouteAndPatterns', () => {
  it('renders empty correctly', () => {
    const onChangeFn = jest.fn()
    const tree = enzyme.shallow(
      <SelectFeedRouteAndPatterns
        feeds={[]}
        onChange={onChangeFn}
        routePatterns={[]}
        routes={[]}
        selectedFeed={null}
        trips={[]}
      />
    )
    expect(tree).toMatchSnapshot()
    expect(onChangeFn).not.toHaveBeenCalled()
    tree.unmount()
  })

  it('renders filled correctly', () => {
    const onChangeFn = jest.fn()
    const tree = enzyme.shallow(
      <SelectFeedRouteAndPatterns
        feeds={[mockFeed]}
        onChange={onChangeFn}
        routePatterns={[mockPattern]}
        routes={[mockRoute.route_id]}
        selectedFeed={mockFeed}
        trips={null}
      />
    )
    expect(tree).toMatchSnapshot()
    expect(onChangeFn).not.toHaveBeenCalled()
    tree.unmount()
  })
})
