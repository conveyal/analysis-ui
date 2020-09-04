import {testAndSnapshot} from 'lib/utils/component'
import {mockModification} from 'lib/utils/mock-data'
import AddTripPattern from '../add-trip-pattern'

const props = {
  allPhaseFromTimetableStops: [],
  allStops: [],
  gtfsStops: [],
  mapState: null,
  modification: mockModification,
  modificationStops: [],
  numbeOfStops: 0,
  projectTimetables: [],
  qualifiedStops: [],
  segmentDistances: [],
  setMapState: jest.fn(),
  timetables: [],
  update: jest.fn()
}

testAndSnapshot(AddTripPattern, props)
