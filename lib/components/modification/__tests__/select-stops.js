//
import enzyme from 'enzyme'
import React from 'react'

import SelectStops from '../select-stops'
import {mockGtfsStop1, mockModification} from '../../../utils/mock-data'

describe('Component > SelectStops', () => {
  it('renders correctly with no feed data', () => {
    const update = jest.fn()
    const setMapStateFn = jest.fn()
    const tree = enzyme.shallow(
      <SelectStops
        modification={mockModification}
        setMapState={setMapStateFn}
        routeStops={[]}
        selectedStops={[]}
        update={update}
      />
    )
    expect(tree).toMatchSnapshot()
    expect(update).not.toHaveBeenCalled()
    expect(setMapStateFn).not.toHaveBeenCalled()
    tree.unmount()
  })

  it('renders correctly with some selected stops', () => {
    const update = jest.fn()
    const setMapStateFn = jest.fn()
    const tree = enzyme.shallow(
      <SelectStops
        modification={mockModification}
        setMapState={setMapStateFn}
        routeStops={[]}
        selectedStops={[mockGtfsStop1]}
        update={update}
      />
    )
    expect(tree).toMatchSnapshot()
    tree.unmount()
  })
})
