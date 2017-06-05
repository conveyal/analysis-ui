/* global describe, it, expect, jest */

describe('Component > Timetable', () => {
  const renderer = require('react-test-renderer')
  const React = require('react')
  const {mockTimetable} = require('../../../utils/mock-data')
  const Timetable = require('../timetable')

  it('renders correctly', () => {
    const removeTimetableFn = jest.fn()
    const replaceTimetableFn = jest.fn()
    const tree = renderer.create(
      <Timetable
        allPhaseFromTimetableStops={{}}
        bidirectional={false}
        modificationStops={[]}
        numberOfStops={0}
        timetable={mockTimetable}
        qualifiedStops={[]}
        remove={removeTimetableFn}
        scenarioTimetables={[]}
        segmentDistances={[]}
        update={replaceTimetableFn}
        />
    ).toJSON()
    expect(tree).toMatchSnapshot()
    expect(removeTimetableFn).not.toBeCalled()
    expect(replaceTimetableFn).not.toBeCalled()
  })
})
