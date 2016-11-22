/* global describe, it, expect, jest */

import { mount } from 'enzyme'
import { mountToJson } from 'enzyme-to-json'
import React from 'react'

import { mockTimetable } from '../../utils/mock-data'

import TimetableEntry from '../timetable-entry'

describe('Component > TimetableEntry', () => {
  it('renders correctly', () => {
    const replaceTimetableFn = jest.fn()
    const tree = mount(
      <TimetableEntry
        timetable={mockTimetable}
        replaceTimetable={replaceTimetableFn}
        />
    )
    expect(mountToJson(tree)).toMatchSnapshot()
    expect(replaceTimetableFn).not.toBeCalled()
  })
})
