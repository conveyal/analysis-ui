/* global describe, it, expect, jest */

import renderer from 'react-test-renderer'
import React from 'react'

import { mockTimetable } from '../../utils/mock-data'

import TimetableEntry from '../timetable-entry'

describe('Component > TimetableEntry', () => {
  it('renders correctly', () => {
    const replaceTimetableFn = jest.fn()
    const tree = renderer.create(
      <TimetableEntry
        timetable={mockTimetable}
        replaceTimetable={replaceTimetableFn}
        />
    ).toJSON()
    expect(tree).toMatchSnapshot()
    expect(replaceTimetableFn).not.toBeCalled()
  })
})
