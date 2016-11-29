/* global describe, it, expect, jest */

import renderer from 'react-test-renderer'
import React from 'react'

import { mockTimetable } from '../../utils/mock-data'

import Timetable from '../timetable'

describe('Component > Timetable', () => {
  it('renders correctly', () => {
    const removeTimetableFn = jest.fn()
    const replaceTimetableFn = jest.fn()
    const tree = renderer.create(
      <Timetable
        timetable={mockTimetable}
        removeTimetable={removeTimetableFn}
        replaceTimetable={replaceTimetableFn}
        />
    ).toJSON()
    expect(tree).toMatchSnapshot()
    expect(removeTimetableFn).not.toBeCalled()
    expect(replaceTimetableFn).not.toBeCalled()
  })
})
