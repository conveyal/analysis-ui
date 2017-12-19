// @flow

import renderer from 'react-test-renderer'
import React from 'react'
import {Map} from 'react-leaflet'
import {Provider} from 'react-redux'

import ModificationsMap from '../modifications-map'
import {makeMockStore, mockStores} from '../../utils/mock-data.js'

const mockStore = makeMockStore(mockStores.init)

describe('Containers > ModificationsMap', () => {
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
