/* global describe, it, expect, jest */

import renderer from 'react-test-renderer'
import React from 'react'

import { mockFeed } from '../../../utils/mock-data'

import AdjustSpeed from '../adjust-speed'

describe('Component > Modification > AdjustSpeed', () => {
  it('renders correctly', () => {
    const props = {
      feeds: [mockFeed],
      modification: {},
      update: jest.fn(),
      routePatterns: [],
      setMapState: jest.fn()
    }
    const tree = renderer.create(
      <AdjustSpeed
        {...props}
        />
    ).toJSON()
    expect(tree).toMatchSnapshot()
    const noCalls = [
      'update',
      'setMapState'
    ]
    noCalls.forEach((fn) => {
      expect(props[fn]).not.toBeCalled()
    })
  })
})
