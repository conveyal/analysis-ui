// @flow
import enzyme from 'enzyme'
import React from 'react'

import AddTrips from '../add-trips'
import {mockModification, mockSegment} from '../../../utils/mock-data'

mockModification.segments.push(mockSegment)

describe('Report > AddTrips', () => {
  it('renders correctly', () => {
    const props = {
      modification: mockModification
    }

    // mount component
    const tree = enzyme.shallow(<AddTrips {...props} />)
    expect(tree).toMatchSnapshot()
  })
})
