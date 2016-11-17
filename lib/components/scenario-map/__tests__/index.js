/* global describe, expect, it */

import { mount } from 'enzyme'
import React from 'react'
import { Provider } from 'react-redux'

import {makeMockStore, mockStores} from '../../../utils/mock-data.js'

const mockStore = makeMockStore(mockStores.init)

describe('Component > ScenarioMap', () => {
  const ScenarioMap = require('../')

  it('renders correctly', () => {
    // mount component
    const tree = mount(
      <Provider store={mockStore}>
        <ScenarioMap />
      </Provider>
      , {
        attachTo: document.getElementById('test')
      }
    )

    expect(tree.find(ScenarioMap).length).toBe(1)
  })
})
