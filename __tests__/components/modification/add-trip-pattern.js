/* global describe, it, expect, jest */

import { mount } from 'enzyme'
import { mountToJson } from 'enzyme-to-json'
import React from 'react'

import AddTripPattern from '../../../lib/components/modification/add-trip-pattern'

describe('Component > Map > AddTripPattern', () => {
  it('renders correctly', () => {
    const mapState = {
      allowExtend: true,
      extendFromEnd: true,
      followRoad: true,
      state: 'add-trip-pattern',
      modificationId: '1234'
    }
    const modification = {
      id: '1234',
      segments: [],
      timetables: [
        {
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
      ],
      bidirectional: false
    }
    const replaceModificationFn = jest.fn()
    const setMapStateFn = jest.fn()
    const updateFn = jest.fn()
    const tree = mount(
      <AddTripPattern
        mapState={mapState}
        modification={modification}
        replaceModification={replaceModificationFn}
        setMapState={setMapStateFn}
        update={updateFn}
        />
    )
    expect(mountToJson(tree)).toMatchSnapshot()
    expect(replaceModificationFn).not.toBeCalled()
    expect(setMapStateFn).not.toBeCalled()
    expect(updateFn).not.toBeCalled()
  })
})
