/* global describe, it, expect, jest */

import renderer from 'react-test-renderer'
import React from 'react'

import { mockFeed, mockTimetable } from '../../utils/mock-data'

import FrequencyEntry from '../frequency-entry'

describe('Component > FrequencyEntry', () => {
  it('renders correctly', () => {
    const replaceTimetableFn = jest.fn()
    const removeTimetableFn = jest.fn()
    const setActiveTripsFn = jest.fn()
    const tree = renderer.create(
      <FrequencyEntry
        feed={mockFeed}
        replaceTimetable={replaceTimetableFn}
        removeTimetable={removeTimetableFn}
        setActiveTrips={setActiveTripsFn}
        timetable={mockTimetable}
        routes={['route1']}
        trip='abcd'
        />
    ).toJSON()
    expect(tree).toMatchSnapshot()
    expect(replaceTimetableFn).not.toBeCalled()
    expect(removeTimetableFn).not.toBeCalled()
    expect(setActiveTripsFn).not.toBeCalled()
  })
})
