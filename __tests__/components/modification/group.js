/* global describe, it, expect, jest */

import React from 'react'
import renderer from 'react-test-renderer'

import { mockComponent } from '../../../testUtils'

jest.mock('../../../lib/components/icon', () => { return mockComponent('Icon') })
jest.mock('../../../lib/components/modification/title', () => { return mockComponent('ModificationTitle') })

import ModificationGroup from '../../../lib/components/modification/group'

describe('ModificationGroup', () => {
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
    const tree = renderer.create(
      <ModificationGroup
        activeModification={activeModification}
        modifications={[activeModification]}
        projectId='1234'
        replaceModification={replaceModificationFn}
        scenarioId='1234'
        type='test'
        />
    ).toJSON()
    expect(tree).toMatchSnapshot()
    expect(replaceModificationFn).not.toBeCalled
  })
})
