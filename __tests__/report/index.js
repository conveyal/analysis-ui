/* global describe, expect, it, jest */

import { mount } from 'enzyme'
import { mountToJson } from 'enzyme-to-json'
import React from 'react'

import { mockFeed, mockModification } from '../../test-utils/mock-data'
import Leaflet from '../../test-utils/mock-leaflet'

import Report from '../../lib/report/index'

mockModification.type = 'adjust-dwell-time'

describe('Report > Report', () => {
  it('renders correctly', () => {
    const props = {
      scenarioId: '1',
      projectId: '1',
      modifications: [mockModification],
      scenario: {},
      bundle: {},
      feedsById: { '1': mockFeed },
      variant: '1',
      loadProject: jest.fn(),
      loadScenario: jest.fn()
    }

    // mount component
    const tree = mount(
      <Report
        {...props}
        />
      , {
        attachTo: document.getElementById('test')
      }
    )
    expect(mountToJson(tree.find('ul'))).toMatchSnapshot()
    expect(Leaflet.geoJson.mock.calls[0][0]).toMatchSnapshot()
    const calls = [
      'loadProject',
      'loadScenario'
    ]
    calls.forEach((fn) => {
      expect(props[fn]).toBeCalled()
    })
  })
})
