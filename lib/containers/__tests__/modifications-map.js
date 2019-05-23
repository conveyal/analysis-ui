import enzyme from 'enzyme'
import React from 'react'
import {Map} from 'react-leaflet'
import {Provider} from 'react-redux'

import {makeMockStore, mockStores} from 'lib/utils/mock-data.js'

import ModificationsMap from '../modifications-map'

jest.mock('react-leaflet')

const mockStore = makeMockStore(mockStores.init)

describe('Containers > ModificationsMap', () => {
  it('renders without errors', () => {
    // mount component
    const tree = enzyme.mount(
      <Provider store={mockStore}>
        <Map>
          <ModificationsMap />
        </Map>
      </Provider>
    )
    expect(tree).toMatchSnapshot()
  })
})
