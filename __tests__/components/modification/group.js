/* global describe, it, expect, jest */

import { mount } from 'enzyme'
import { mountToJson } from 'enzyme-to-json'
import React from 'react'

import ModificationGroup from '../../../lib/components/modification/group'

describe('Component > Map > ModificationGroup', () => {
  it('renders correctly', () => {
    const activeModification = {
      id: '1234',
      name: 'Test Modification',
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
      bidirectional: false,
      showOnMap: false
    }
    const replaceModificationFn = jest.fn()
    const tree = mount(
      <ModificationGroup
        activeModification={activeModification}
        modifications={[activeModification]}
        projectId='1234'
        replaceModification={replaceModificationFn}
        scenarioId='1234'
        type='test'
        />
    )
    expect(mountToJson(tree)).toMatchSnapshot()
    expect(replaceModificationFn).not.toBeCalled()
  })
})
