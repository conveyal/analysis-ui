/* global describe, expect, it */

import {latLngBounds} from 'leaflet'
import React from 'react'
import renderer from 'react-test-renderer'

describe('Report > MiniMap', () => {
  const MiniMap = require('../mini-map')

  it('renders correctly', () => {
    const props = {
      bounds: latLngBounds(
        [
          [40.712, -74.227],
          [40.774, -74.125]
        ]
      )
    }

    // mount component
    const tree = renderer.create(
      <MiniMap
        {...props}
        />
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
