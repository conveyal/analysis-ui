// @flow

import renderer from 'react-test-renderer'
import React from 'react'

import TimetableEntry from '../timetable-entry'
import {mockTimetable} from '../../../utils/mock-data'

describe('Component > TimetableEntry', () => {
  it('renders correctly', () => {
    const update = jest.fn()
    const tree = renderer
      .create(
        <TimetableEntry
          allPhaseFromTimetableStops={{}}
          bidirectional={false}
          modificationStops={[]}
          projectTimetables={[]}
          timetable={mockTimetable}
          update={update}
        />
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
    expect(update).not.toHaveBeenCalled()
  })
})
