// @flow
import enzyme from 'enzyme'
import React from 'react'

import SelectFeedAndRoutes from '../select-feed-and-routes'
import {mockFeed} from '../../../utils/mock-data'

describe('Component > SelectFeedAndRoutes', () => {
  it('renders correctly', () => {
    const onChangeFn = jest.fn()
    const tree = enzyme.shallow(
      <SelectFeedAndRoutes
        feeds={[mockFeed]}
        onChange={onChangeFn}
        selectedFeed={null}
        selectedRouteIds={[]}
      />
    )
    expect(tree).toMatchSnapshot()
    expect(onChangeFn).not.toHaveBeenCalled()
    tree.unmount()
  })
})
