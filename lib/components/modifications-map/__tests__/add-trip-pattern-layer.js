// @flow

import React from 'react'
import {Map} from 'react-leaflet'
import renderer from 'react-test-renderer'

import AddTripPatternLayer from '../add-trip-pattern-layer'
import {mockSegment} from '../../../utils/mock-data'

describe('Project-Map > AddTripPatternLayer', () => {
  it('renders correctly', () => {
    const props = {
      segments: [mockSegment],
      bidirectional: false
    }

    // mount component
    const tree = renderer
      .create(
        <Map>
          <AddTripPatternLayer {...props} />
        </Map>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })
})
