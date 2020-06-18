import {testAndSnapshot} from 'lib/utils/component'

import {mockModification} from 'lib/utils/mock-data'
import AddTripPattern from '../add-trip-pattern'

testAndSnapshot(AddTripPattern, {
  modification: mockModification,
  setMapState: jest.fn()
})
