/* global describe, expect, it */

import renderer from 'react-test-renderer'
import React from 'react'
import { Provider } from 'react-redux'

import {makeMockStore, mockStores} from '../../../utils/mock-data.js'

const mockStore = makeMockStore(mockStores.init)

describe('Component > ScenarioMap', () => {
  const ScenarioMap = require('../')

  it('renders correctly', () => {
    // mount component
    const tree = renderer.create(
      <Provider store={mockStore}>
        <ScenarioMap />
      </Provider>
    ).toJSON()

    expect(tree).toMatchSnapshot()
  })
})
