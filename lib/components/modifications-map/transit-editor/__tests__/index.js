//
import enzyme from 'enzyme'
import Leaflet from 'leaflet'
import React from 'react'

import {
  mockFeed,
  mockModification,
  mockSegment,
  mockGtfsStops
} from '../../../../utils/mock-data.js'
import {TransitEditor} from '../'

jest.mock('leaflet')

mockFeed.stops = mockGtfsStops
mockModification.segments = [mockSegment]

describe('Component > Transit-Editor > TransitEditor', () => {
  it('renders correctly', async () => {
    const props = {
      allowExtend: true,
      allStops: mockGtfsStops,
      extendFromEnd: true,
      feeds: [mockFeed],
      followRoad: true,
      leaflet: {
        map: new Leaflet.Map()
      },
      modification: mockModification,
      spacing: 0,
      updateModification: jest.fn()
    }

    // mount component
    const tree = enzyme.shallow(<TransitEditor {...props} />)
    expect(props.updateModification).not.toHaveBeenCalled()
    // expect marker to be added to map by intercepting call to Leaflet
    expect(tree).toMatchSnapshot()
    tree.unmount()
  })
})
