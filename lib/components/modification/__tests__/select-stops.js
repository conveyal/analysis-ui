// @flow

import renderer from 'react-test-renderer'
import React from 'react'

import SelectStops from '../select-stops'
import {mockGtfsStop1, mockModification} from '../../../utils/mock-data'

describe('Component > SelectStops', () => {
  it('renders correctly with no feed data', () => {
    const update = jest.fn()
    const setMapStateFn = jest.fn()
    const tree = renderer
      .create(
        <SelectStops
          modification={mockModification}
          setMapState={setMapStateFn}
          routeStops={[]}
          selectedStops={[]}
          update={update}
        />
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
    expect(update).not.toBeCalled()
    expect(setMapStateFn).not.toBeCalled()
  })

  it('renders correctly with some selected stops', () => {
    const update = jest.fn()
    const setMapStateFn = jest.fn()
    const tree = renderer
      .create(
        <SelectStops
          modification={mockModification}
          setMapState={setMapStateFn}
          routeStops={[]}
          selectedStops={[mockGtfsStop1]}
          update={update}
        />
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })
})
