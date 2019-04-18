// @flow
import enzyme from 'enzyme'
import clone from 'lodash/cloneDeep'
import React from 'react'

import {
  mockModification,
  mockSegment
} from '../../../utils/mock-data'
import CopyTimetable from '../copy-timetable'

const mockRegionId = 'r1'
const mockRegionIdWithNoTimetables = 'r2'

const mockProject = {
  _id: 'p1',
  modifications: [mockModification],
  name: 'mock project'
}

// response only includes regions, projects and modifications that
// all have at least one timetable
const mockResponse = [{
  projects: [{
    name: 'mock project',
    _id: 'p1',
    modifications: [{
      timetables: [{
        _id: 't1',
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: true,
        saturday: false,
        sunday: false,
        name: 'M-F',
        startTime: 25200,
        endTime: 79200,
        headwaySecs: 600,
        exactTimes: false,
        phaseAtStop: null,
        phaseFromTimetable: null,
        phaseFromStop: null,
        phaseSeconds: 0,
        dwellTime: 0,
        segmentSpeeds: [16],
        dwellTimes: []
      }],
      name: 'mock modification',
      _id: 'm1',
      segments: [mockSegment]
    }]
  }],
  name: 'mock region',
  _id: 'r1'
}]

let serverResponse = mockResponse

function getTimetables (next) {
  return next({
    status: 200,
    value: serverResponse
  })
}

function timeoutPromise () {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, 5)
  })
}

describe('Component > Modification > CopyTimetable', () => {
  it('renders correctly', async () => {
    serverResponse = mockResponse

    const wrapper = enzyme.shallow(
      <CopyTimetable
        create={jest.fn()}
        currentModification={mockModification}
        currentProject={mockProject}
        currentRegionId={mockRegionId}
        getTimetables={next => {
          setTimeout(() => getTimetables(next), 2)
        }}
      />
    )

    // Look for an element that should only exist once loaded
    expect(wrapper.find({label: 'Timetable'}).exists()).toBeFalsy()

    // wait for load to finish
    await timeoutPromise()

    // Look for an existsing element
    expect(wrapper.find({label: 'Timetable'}).exists()).toBeTruthy()

    // Snapshot the loaded state
    expect(wrapper).toMatchSnapshot()

    wrapper.unmount()
  })

  it('can select a timetable', async () => {
    serverResponse = mockResponse

    const create = jest.fn()
    const wrapper = enzyme.mount(
      <CopyTimetable
        create={create}
        currentModification={mockModification}
        currentProject={mockProject}
        currentRegionId={mockRegionId}
        getTimetables={getTimetables}
      />
    )

    // wait for load to finish
    await timeoutPromise()

    // confirm the selected timetable
    wrapper
      .find('Button')
      .simulate('click')

    expect(create.mock.calls[0][0]).toMatchSnapshot()
    wrapper.unmount()
  })

  // if rendering a region without any timetables, show the first
  // timetable that is available
  it('renders with a region without timetables', async () => {
    serverResponse = mockResponse

    const wrapper = enzyme.shallow(
      <CopyTimetable
        create={jest.fn()}
        currentModification={mockModification}
        currentProject={mockProject}
        currentRegionId={mockRegionIdWithNoTimetables}
        getTimetables={getTimetables}
      />
    )

    // wait for load to finish
    await timeoutPromise()

    // snapshot loaded state
    expect(wrapper).toMatchSnapshot()

    wrapper.unmount()
  })

  // a test case for when no timetables are available to copy
  it('renders when no timetables exist in database', () => {
    const wrapper = enzyme.shallow(
      <CopyTimetable
        create={jest.fn()}
        currentModification={mockModification}
        currentProject={mockProject}
        currentRegionId={mockRegionIdWithNoTimetables}
        getTimetables={fn => fn({status: 200, value: []})}
      />
    )

    // snapshot loaded state
    expect(wrapper).toMatchSnapshot()

    wrapper.unmount()
  })

  describe('segment warnings', () => {
    it('shows a warning when current modification has no segments', async () => {
      serverResponse = mockResponse

      const wrapper = enzyme.shallow(
        <CopyTimetable
          create={jest.fn()}
          currentModification={{
            ...mockModification,
            segments: []
          }}
          currentProject={mockProject}
          currentRegionId={mockRegionId}
          getTimetables={getTimetables}
        />
      )

      // wait for load to finish
      await timeoutPromise()

      // snapshot loaded state
      expect(wrapper).toMatchSnapshot()

      wrapper.unmount()
    })

    it('shows a warning when modification of timetable being copied has no segments', async () => {
      serverResponse = clone(mockResponse)
      serverResponse[0].projects[0].modifications[0].segments = []
      serverResponse[0].projects[0].modifications[0].timetables[0].segmentSpeeds = []

      const wrapper = enzyme.shallow(
        <CopyTimetable
          create={jest.fn()}
          currentModification={mockModification}
          currentProject={mockProject}
          currentRegionId={mockRegionId}
          getTimetables={getTimetables}
        />
      )

      // wait for load to finish
      await timeoutPromise()

      // snapshot loaded state
      expect(wrapper).toMatchSnapshot()

      wrapper.unmount()
    })

    it('shows a warning when modification of timetable being copied has more segments', async () => {
      serverResponse = clone(mockResponse)
      serverResponse[0].projects[0].modifications[0].segments.push(mockSegment)
      serverResponse[0].projects[0].modifications[0].timetables[0].segmentSpeeds.push(17)

      const wrapper = enzyme.shallow(
        <CopyTimetable
          create={jest.fn()}
          currentModification={mockModification}
          currentProject={mockProject}
          currentRegionId={mockRegionId}
          getTimetables={getTimetables}
        />
      )

      // wait for load to finish
      await timeoutPromise()

      // snapshot loaded state
      expect(wrapper).toMatchSnapshot()

      wrapper.unmount()
    })

    it('shows a warning when modification of timetable being copied has less segments', async () => {
      serverResponse = mockResponse

      const segments = [...mockModification.segments, mockSegment]

      const wrapper = enzyme.shallow(
        <CopyTimetable
          create={jest.fn()}
          currentModification={{
            ...mockModification,
            segments
          }}
          currentProject={mockProject}
          currentRegionId={mockRegionId}
          getTimetables={getTimetables}
        />
      )

      // wait for load to finish
      await timeoutPromise()

      // snapshot loaded state
      expect(wrapper).toMatchSnapshot()

      wrapper.unmount()
    })
  })
})
