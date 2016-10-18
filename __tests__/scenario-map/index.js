/* global describe, it, expect, jest */

import { mount } from 'enzyme'
import React from 'react'
import { Provider } from 'react-redux'

import '../../test-utils/mock-leaflet'
import { mockFeed, mockMapState, mockModification } from '../../test-utils/mock-data.js'
import makeMockStore from '../../test-utils/mock-store.js'

import ScenarioMap from '../../lib/scenario-map/index'

const mockStore = makeMockStore({
  analysis: {},
  mapState: mockMapState,
  scenario: {}
})

describe('Component > ScenarioMap', () => {
  it('renders correctly', () => {
    const props = {
      activeModification: mockModification,
      bundleId: '1',
      centerLatlng: { lat: 38.8886, lng: -77.0430 },
      feeds: mockFeed,
      feedsById: { '1': mockFeed },
      modifications: [mockModification],
      modificationsById: { '1': mockModification },
      scenarioIsReady: true,
      replaceModification: jest.fn(),
      setMapState: jest.fn()
    }

    // mount component
    mount(
      <Provider store={mockStore}>
        <ScenarioMap
          {...props}
          />
      </Provider>
      , {
        attachTo: document.getElementById('test')
      }
    )

    const noCalls = [
      'replaceModification',
      'setMapState'
    ]
    noCalls.forEach((fn) => {
      expect(props[fn]).not.toBeCalled()
    })
  })
})
