/* global describe, it, expect */

import React from 'react'
import {Map} from 'react-leaflet'
import renderer from 'react-test-renderer'

import {mockSegment} from '../../../utils/mock-data'

describe('Scenario-Map > AddTripPatternLayer', () => {
  const AddTripPatternLayer = require('../add-trip-pattern-layer')
  it('renders correctly', () => {
    const props = {
      segments: [mockSegment],
      bidirectional: false
    }

    // mount component
    const tree = renderer.create(
      <Map>
        <AddTripPatternLayer
          {...props}
          />
      </Map>
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
