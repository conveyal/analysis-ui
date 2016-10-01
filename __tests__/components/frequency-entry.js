/* global describe, it, expect, jest */

import React from 'react'
import renderer from 'react-test-renderer'

import { mockComponents } from '../../testUtils'

jest.mock('../../lib/components/buttons', () => { return mockComponents(['Button']) })
jest.mock('../../lib/components/icon', () => 'Icon')
jest.mock('../../lib/components/input', () => { return mockComponents(['Text']) })
jest.mock('../../lib/components/select-patterns', () => 'SelectPatterns')
jest.mock('../../lib/components/select-trip', () => 'SelectTrip')
jest.mock('../../lib/components/timetable-entry', () => 'TimetableEntry')

import FrequencyEntry from '../../lib/components/frequency-entry'

describe('FrequencyEntry', () => {
  it('renders correctly', () => {
    const replaceTimetableFn = jest.fn()
    const removeTimetableFn = jest.fn()
    const setActiveTripsFn = jest.fn()
    const timetable = {
      name: 'mock timetable',
      patternTrips: 'mockPatternTrips',
      sourceTrip: 'mockSourceTrip'
    }
    const tree = renderer.create(
      <FrequencyEntry
        feed={{}}
        replaceTimetable={replaceTimetableFn}
        removeTimetable={removeTimetableFn}
        setActiveTrips={setActiveTripsFn}
        timetable={timetable}
        routes={[]}
        trip='mockTrip'
        />
    ).toJSON()
    expect(tree).toMatchSnapshot()
    expect(replaceTimetableFn).not.toBeCalled()
    expect(removeTimetableFn).not.toBeCalled()
    expect(setActiveTripsFn).not.toBeCalled()
  })
})
