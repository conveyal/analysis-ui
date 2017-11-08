// @flow
import mock from 'jest-mock'

import {mount} from 'enzyme'
import {mountToJson} from 'enzyme-to-json'
import React from 'react'

import {mockTimetable} from '../../../utils/mock-data'
import Timetable from '../timetable'

const {describe, expect, it} = global
describe('Component > Timetable', () => {
  it('renders correctly', () => {
    const removeTimetableFn = mock.fn()
    const replaceTimetableFn = mock.fn()
    const wrapper = mount(
      <Timetable
        allPhaseFromTimetableStops={{}}
        bidirectional={false}
        modificationStops={[]}
        numberOfStops={0}
        timetable={mockTimetable}
        qualifiedStops={[]}
        scenarioTimetables={[]}
        segmentDistances={[]}

        remove={removeTimetableFn}
        setMapState={mock.fn()}
        update={replaceTimetableFn}
      />
    )

    // not expanded initially
    expect(mountToJson(wrapper)).toMatchSnapshot()

    wrapper
      .find('a.panel-heading')
      .simulate('click')

    // should be expanded now
    expect(mountToJson(wrapper)).toMatchSnapshot()

    expect(removeTimetableFn).not.toBeCalled()
    expect(replaceTimetableFn).not.toBeCalled()
  })
})
