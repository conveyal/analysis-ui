// @flow

import renderer from 'react-test-renderer'
import React from 'react'
import {Map} from 'react-leaflet'

import StopLayer from '../stop-layer'
import {mockGtfsStops} from '../../../../utils/mock-data.js'

describe('Component > Transit-Editor > StopLayer', () => {
  it('renders correctly', () => {
    const props = {
      stops: mockGtfsStops
    }

    // mount component
    const tree = renderer
      .create(
        <Map>
          <StopLayer {...props} />
        </Map>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })
})
