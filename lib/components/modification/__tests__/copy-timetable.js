// @flow

import nock from 'nock'
import React from 'react'

import {mockWithProvider} from '../../../utils/mock-data'

import CopyTimetable from '../copy-timetable'

describe('Component > Modification > CopyTimetable', () => {
  const mockRegionId = 'r1'
  const mockTimetable = {
    _id: 't1',
    dwellTimes: [],
    name: 'mock timetable',
    segmentSpeeds: []
  }
  const mockModification = {
    _id: 'm1',
    name: 'mock modification',
    segments: [],
    timetables: [mockTimetable]
  }
  const mockProject = {
    _id: 'p1',
    modifications: [mockModification],
    name: 'mock project'
  }

  it('renders correctly', async () => {
    prepareNock()

    const {snapshot} = mockWithProvider(
      <CopyTimetable
        create={jest.fn()}
        currentModification={mockModification}
        currentProject={mockProject}
        currentRegionId={mockRegionId}
        getTimetables={getTimetables}
        />
    )

    // snapshot loading state
    expect(snapshot()).toMatchSnapshot()

    // wait for load to finish
    await timeoutPromise()

    // snapshot loaded state
    expect(snapshot()).toMatchSnapshot()
  })

  it('can select a timetable', async () => {
    prepareNock()

    const create = jest.fn()
    const {wrapper} = mockWithProvider(
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
      .find('a')
      .simulate('click')

    expect(create.mock.calls[0][0]).toMatchSnapshot()
  })
})

function getTimetables () {
  return fetch('http://mockhost.com/api/timetable/')
    .then(res => res.json())
    .then(json => {
      return {
        status: 200,
        value: json
      }
    })
}

const mockResponse = [{
  projects: [],
  name: 'mock region with no projects',
  _id: '5ae12de0fe63903d62fc7dd0'
}, {
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
        segmentSpeeds: [],
        dwellTimes: []
      }],
      name: 'mock modification',
      _id: 'm1',
      segments: []
    }]
  }],
  name: 'mock region',
  _id: 'r1'
}]

function prepareNock () {
  nock('http://mockhost.com/')
    .get(/^\/api\/timetable/)
    .reply(200, mockResponse)
}

function timeoutPromise () {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, 500)
  })
}
