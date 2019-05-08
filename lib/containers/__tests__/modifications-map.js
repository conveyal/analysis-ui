//
import enzyme from 'enzyme'
import toJSON from 'enzyme-to-json'
import React from 'react'
import {Map} from 'react-leaflet'
import {Provider} from 'react-redux'

import ModificationsMap from '../modifications-map'
import {makeMockStore, mockStores} from '../../utils/mock-data.js'

jest.mock('react-leaflet')

const mockStore = makeMockStore(mockStores.init)

describe('Containers > ModificationsMap', () => {
  it('renders correctly', () => {
    // mount component
    const tree = enzyme.mount(
      <Provider store={mockStore}>
        <Map>
          <ModificationsMap />
        </Map>
      </Provider>
    )
    const modMap = tree.find('ModificationsMap')
    expect(toJSON(modMap, {mode: 'shallow'})).toMatchSnapshot()
  })
})
