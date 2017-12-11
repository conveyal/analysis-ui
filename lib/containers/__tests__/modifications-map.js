/* global describe, expect, it */

import renderer from 'react-test-renderer'
import React from 'react'
import {Map} from 'react-leaflet'
import {Provider} from 'react-redux'

import {makeMockStore, mockStores} from '../../utils/mock-data.js'

const mockStore = makeMockStore(mockStores.init)

describe('Containers > ModificationsMap', () => {
  const ModificationsMap = require('../modifications-map')

  it('renders correctly', () => {
    // mount component
    const tree = renderer
      .create(
        <Provider store={mockStore}>
          <Map>
            <ModificationsMap />
          </Map>
        </Provider>
      )
      .toJSON()

    expect(tree).toMatchSnapshot()
  })
})
