import {testAndSnapshot} from 'lib/utils/component'
import {
  mockFeed,
  mockModification,
  mockSegment,
  mockGtfsStops
} from 'lib/utils/mock-data'
import TransitEditor from '../'

jest.mock('leaflet')

mockFeed.stops = mockGtfsStops
mockModification.segments = [mockSegment]

describe('Component > Transit-Editor > TransitEditor', () => {
  it('renders correctly', async () => {
    const props: Parameters<typeof TransitEditor>[0] = {
      allowExtend: true,
      allStops: mockGtfsStops,
      extendFromEnd: true,
      followRoad: true,
      modification: mockModification as CL.AddTripPattern,
      spacing: 0,
      updateModification: jest.fn()
    }

    // mount component
    testAndSnapshot(TransitEditor, props)
    expect(props.updateModification).not.toHaveBeenCalled()
    // expect marker to be added to map by intercepting call to Leaflet
  })
})
