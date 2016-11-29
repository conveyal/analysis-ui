/* global describe, expect, it */

import renderer from 'react-test-renderer'
import React from 'react'
import { Map } from 'react-leaflet'

import DirectionIcon from '../direction-icon'

describe('Component > DirectionIcon', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <Map>
        <DirectionIcon
          bearing={123}
          clickable
          color='blue'
          coordinates={[12, 34]}
          iconSize={20}
          />
      </Map>
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
