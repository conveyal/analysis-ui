/* global describe, it, expect, jest */

import React from 'react'
import renderer from 'react-test-renderer'

import Timetable from '../../lib/components/timetable'

describe('Timetable', () => {
  it('renders correctly', () => {
    const timetable = {
      name: 'Test timetable',
      speed: 40,
      dwellTime: 10,
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: false,
      sunday: false,
      headwaySecs: 900, // 15 minutes
      startTime: 28800, // 8am
      endTime: 57600 // 4pm
    }
    const removeTimetableFn = jest.fn()
    const replaceTimetableFn = jest.fn()
    const tree = renderer.create(
      <Timetable
        timetable={timetable}
        removeTimetable={removeTimetableFn}
        replaceTimetable={replaceTimetableFn}
        />
    ).toJSON()
    expect(tree).toMatchSnapshot()
    expect(removeTimetableFn).not.toBeCalled
    expect(replaceTimetableFn).not.toBeCalled
  })
})
