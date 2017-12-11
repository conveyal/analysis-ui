// @flow

import React from 'react'
import renderer from 'react-test-renderer'

import AddTrips from '../add-trips'
import {mockModification, mockSegment} from '../../../utils/mock-data'

mockModification.segments.push(mockSegment)

describe('Report > AddTrips', () => {
  it('renders correctly', () => {
    const props = {
      modification: mockModification
    }

    // mount component
    const tree = renderer.create(<AddTrips {...props} />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
