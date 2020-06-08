import {testAndSnapshot} from 'lib/utils/component'
import {mockFeed} from 'lib/utils/mock-data'

import SelectFeedAndRoutes from '../select-feed-and-routes'

testAndSnapshot(SelectFeedAndRoutes, {
  feeds: [mockFeed],
  onChange: jest.fn()
})
