/* global describe, it, expect, jest */

import React from 'react'
import renderer from 'react-test-renderer'

import Title from '../../../lib/components/modification/title'

describe('Scenario', () => {
  it('renders correctly', () => {
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
    const tree = renderer.create(
      <Title
        active
        modification={modification}
        name='Title'
        projectId='1234'
        replaceModification={replaceModificationFn}
        scenarioId='1234'
        showOnMap
        />
    ).toJSON()
    expect(tree).toMatchSnapshot()
    expect(replaceModificationFn).not.toBeCalled
  })
})
