/* global describe, it, expect, jest */

import renderer from 'react-test-renderer'
import React from 'react'

import {mockFeed, mockPattern, mockStops} from '../../../utils/mock-data'

import ConvertToFrequency from '../convert-to-frequency'

describe('Component > Modification > ConvertToFrequency', () => {
  it('renders correctly', () => {
    const props = {
      allPhaseFromTimetableStops: {},
      feeds: [mockFeed],
      modification: {},
      routePatterns: [mockPattern],
      routeStops: mockStops,
      scenarioTimetables: [],
      selectedFeed: null,
      setActiveTrips: jest.fn(),
      update: jest.fn()
    }
    const tree = renderer.create(<ConvertToFrequency {...props} />).toJSON()
    expect(tree).toMatchSnapshot()
    const noCalls = ['setActiveTrips', 'update']
    noCalls.forEach(fn => {
      expect(props[fn]).not.toBeCalled()
    })
  })
})
