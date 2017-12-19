// @flow

import * as query from '../query'

describe('graphql', () => {
  it('formats data query correctly', () => {
    expect(
      query.compose(query.data, {bundleId: 1, routeIds: [1, 2]})
    ).toMatchSnapshot()
  })

  it('formats route query correctly', () => {
    expect(
      query.compose(query.route, {bundleId: 1, routeIds: [1, 2]})
    ).toMatchSnapshot()
  })
})
