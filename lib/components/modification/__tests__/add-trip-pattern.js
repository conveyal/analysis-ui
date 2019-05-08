//
import enzyme from 'enzyme'
import React from 'react'

import {mockMapState, mockModification} from '../../../utils/mock-data'
import {AddTripPattern} from '../add-trip-pattern'

describe('Component > Modification > AddTripPattern', () => {
  it('renders correctly', () => {
    const setMapStateFn = jest.fn()
    const updateFn = jest.fn()
    const tree = enzyme.shallow(
      <AddTripPattern
        allPhaseFromTimetableStops={{}}
        extendFromEnd
        gtfsStops={[]}
        allStops
        mapState={mockMapState}
        modification={mockModification}
        numberOfStops={0}
        qualifiedStops={[]}
        projectTimetables={[]}
        segmentDistances={[]}
        setMapState={setMapStateFn}
        update={updateFn}
      />
    )
    expect(tree).toMatchSnapshot()
    expect(setMapStateFn).not.toHaveBeenCalled()
    expect(updateFn).not.toHaveBeenCalled()
    tree.unmount()
  })
})
