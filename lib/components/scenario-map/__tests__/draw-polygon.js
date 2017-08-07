/* global describe, it, jest */

import React from 'react'
import {Map} from 'react-leaflet'
import renderer from 'react-test-renderer'
import DrawPolygon from '../draw-polygon'

describe('Scenario-Map > DrawPolygon', () => {
  it('works correctly', () => {
    const tree = renderer.create(
      <Map>
        <DrawPolygon
          />
      </Map>
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
