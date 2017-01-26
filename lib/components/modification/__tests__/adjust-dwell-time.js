/* global describe, it, expect, jest */

import renderer from 'react-test-renderer'
import React from 'react'

import {mockFeed, mockModification} from '../../../utils/mock-data'

import AdjustDwellTime from '../adjust-dwell-time'

describe('Component > Modification > AdjustDwellTime', () => {
  it('renders correctly', () => {
    const props = {
      addControl: jest.fn(),
      addLayer: jest.fn(),
      feeds: [mockFeed],
      feedsById: { '1': mockFeed },
      modification: mockModification,
      removeControl: jest.fn(),
      removeLayer: jest.fn(),
      setMapState: jest.fn(),
      update: jest.fn()
    }
    const tree = renderer.create(
      <AdjustDwellTime
        {...props}
        />
    ).toJSON()
    expect(tree).toMatchSnapshot()
    const noCalls = [
      'addControl',
      'addLayer',
      'removeControl',
      'removeLayer',
      'setMapState',
      'update'
    ]
    noCalls.forEach((fn) => {
      expect(props[fn]).not.toBeCalled()
    })
  })
})
