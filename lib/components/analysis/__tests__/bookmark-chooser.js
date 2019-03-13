// @flow
import enzyme from 'enzyme'
import React from 'react'

import BookmarkChooser from '../bookmark-chooser'
import {mockProfileRequest, mockBookmark} from '../../../utils/mock-data'

const props = {
  bookmarks: [mockBookmark], // TODO
  isochroneLonLat: {lon: -122.123, lat: 37.363}, // Foothill College, Los Altos Hills, CA, USA
  isFetchingIsochrone: false,
  profileRequest: mockProfileRequest,
  regionId: 'REGION',
  comparisonInProgress: false,
  currentOpportunityDataset: 'Jobs_total',
  isochroneCutoff: 60,
  modifications: [],
  projectId: 'PROJECT',
  variantIndex: 0,
  workerVersion: 'v2.1.2'
}

describe('analysis > bookmark', () => {
  it('renders correctly', () => {
    const tree = enzyme.shallow(<BookmarkChooser {...props} />)
    expect(tree).toMatchSnapshot()
    tree.unmount()
  })
})
