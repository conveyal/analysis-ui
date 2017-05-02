/* global describe, it, expect, jest */

describe('Component > SelectFeedRouteAndPatterns', () => {
  const renderer = require('react-test-renderer')
  const React = require('react')
  const SelectFeedRouteAndPatterns = require('../select-feed-route-and-patterns')
  const {mockFeed, mockRoute, mockPattern} = require('../../../utils/mock-data')

  it('renders empty correctly', () => {
    const onChangeFn = jest.fn()
    const tree = renderer.create(
      <SelectFeedRouteAndPatterns
        feeds={[]}
        onChange={onChangeFn}
        routePatterns={[]}
        routes={[]}
        />
    ).toJSON()
    expect(tree).toMatchSnapshot()
    expect(onChangeFn).not.toBeCalled()
  })

  it('renders filled correctly', () => {
    const onChangeFn = jest.fn()
    const tree = renderer.create(
      <SelectFeedRouteAndPatterns
        feeds={[mockFeed]}
        onChange={onChangeFn}
        routePatterns={[mockPattern]}
        routes={[mockRoute.id]}
        />
    ).toJSON()
    expect(tree).toMatchSnapshot()
    expect(onChangeFn).not.toBeCalled()
  })
})
