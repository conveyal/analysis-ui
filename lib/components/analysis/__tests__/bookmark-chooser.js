/* global describe, it, expect */

/** tests for the analysis bookmark component */

import renderer from 'react-test-renderer'
import React from 'react'
import BookmarkChooser from '../bookmark-chooser'
import {mockProfileRequest, mockBookmark} from '../../../utils/mock-data'

const props = {
  bookmarks: [mockBookmark], // TODO
  isochroneLonLat: {lon: -122.123, lat: 37.363}, // Foothill College, Los Altos Hills, CA, USA
  isFetchingIsochrone: false,
  profileRequest: mockProfileRequest,
  projectId: 'PROJECT',
  comparisonInProgress: false,
  currentOpportunityDataset: 'Jobs_total',
  isochroneCutoff: 60,
  modifications: [],
  scenarioId: 'SCENARIO',
  variantIndex: 0,
  workerVersion: 'v2.1.2'
}

describe('analysis > bookmark', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<BookmarkChooser {...props} />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
