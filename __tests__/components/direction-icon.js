/* global describe, it, expect, jest */

import React from 'react'
import renderer from 'react-test-renderer'

import { mockComponents } from '../../testUtils'

jest.mock('leaflet', () => { return { DivIcon: () => 'DivIcon', point: 'point' } })
jest.mock('react-leaflet', () => { return mockComponents(['Marker']) })

import DirectionIcon from '../../lib/components/direction-icon'

describe('DirectionIcon', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <DirectionIcon
        bearing={123}
        clickable
        color='blue'
        coordinates={[12, 34]}
        iconSize={20}
        />
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
