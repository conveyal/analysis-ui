/* global describe, it, expect, jest */

describe('Component > TimetableEntry', () => {
  const renderer = require('react-test-renderer')
  const React = require('react')
  const {mockTimetable} = require('../../utils/mock-data')
  const TimetableEntry = require('../timetable-entry')

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
