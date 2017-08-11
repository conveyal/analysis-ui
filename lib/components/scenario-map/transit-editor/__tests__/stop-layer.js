/* global describe, expect, it */

import renderer from 'react-test-renderer'
import React from 'react'
import {Map} from 'react-leaflet'

import {mockStops} from '../../../../utils/mock-data.js'

describe('Component > Transit-Editor > StopLayer', () => {
  const StopLayer = require('../stop-layer')

  it('renders correctly', () => {
    const props = {
      stops: mockStops
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
