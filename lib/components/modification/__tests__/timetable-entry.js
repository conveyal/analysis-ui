//
import enzyme from 'enzyme'
import React from 'react'

import TimetableEntry from '../timetable-entry'
import {mockTimetable} from '../../../utils/mock-data'

describe('Component > TimetableEntry', () => {
  it('renders correctly', () => {
    const update = jest.fn()
    const tree = enzyme.shallow(
      <TimetableEntry
        allPhaseFromTimetableStops={{}}
        bidirectional={false}
        modificationStops={[]}
        projectTimetables={[]}
        timetable={mockTimetable}
        update={update}
      />
    )
    expect(tree).toMatchSnapshot()
    expect(update).not.toHaveBeenCalled()
    tree.unmount()
  })
})
