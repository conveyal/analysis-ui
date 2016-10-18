/* global describe, it, expect, jest */

import { mount } from 'enzyme'
import React from 'react'
import { Provider } from 'react-redux'

import '../../test-utils/mock-leaflet'
import makeMockStore from '../../test-utils/mock-store.js'

import Application from '../../lib/components/application'

const mockStore = makeMockStore({
  analysis: {},
  mapState: {
    components: []
  },
  scenario: {}
})

describe('Component > Application', () => {
  it('renders correctly', () => {
    const props = {
      // actions
      loadAllProjects: jest.fn(),
      login: jest.fn(),
      logout: jest.fn(),
      push: jest.fn(),

      // state
      center: { lat: 38.8886, lng: -77.0430 },
      feedsById: {},
      hasScenario: false,
      mapComponents: [],
      projectId: '1',
      outstandingRequests: 0,
      userIsLoggedIn: false,
      username: 'test-user',
      zoom: 12
    }

    // mount component
    mount(
      <Provider store={mockStore}>
        <Application
          {...props}
          />
      </Provider>
      , {
        attachTo: document.getElementById('test')
      }
    )
    // when trying to make a snapshot from mountToJson, I got an out of memory error

    expect(props.loadAllProjects).toBeCalled()
    const noCalls = [
      'login',
      'logout',
      'push'
    ]
    noCalls.forEach((fn) => {
      expect(props[fn]).not.toBeCalled()
    })
  })
})
