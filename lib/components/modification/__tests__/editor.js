/* global describe, it, expect, jest */

import renderer from 'react-test-renderer'
import React from 'react'

import {
  mockFeed,
  mockMapState,
  mockModification,
  mockPattern,
  mockStop
} from '../../../utils/mock-data'

import ModificationEditor from '../editor'

describe('Component > Modification > ModificationEditor', () => {
  const props = {
    allVariants: [],
    bundleId: '1',
    isLoaded: true,
    lastStopDistanceFromStart: 0,
    modification: mockModification,
    name: 'Test Modification',
    remove: jest.fn(),
    replace: jest.fn(),
    type: 'add-trip-pattern',
    variants: [],
    feeds: [mockFeed],
    mapState: mockMapState,
    numberOfStops: 0,
    routePatterns: [mockPattern],
    routeStops: [mockStop],
    selectedStops: [mockStop],
    segmentDistances: [],
    setActiveTrips: jest.fn(),
    setMapState: jest.fn(),
    stops: []
  }

  it('renders correctly', () => {
    const tree = renderer.create(
      <ModificationEditor
        {...props}
        />
    ).toJSON()
    expect(tree).toMatchSnapshot()
    const noCalls = [
      'remove',
      'replace',
      'setActiveTrips',
      'setMapState'
    ]
    noCalls.forEach((fn) => {
      expect(props[fn]).not.toBeCalled()
    })
  })

  it('render just the title if not loaded', () => {
    const props2 = {...props, isLoaded: false}
    const tree = renderer.create(
      <ModificationEditor
        {...props2}
        />
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
