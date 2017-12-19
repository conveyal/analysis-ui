// @flow

import nock from 'nock'
import React from 'react'
import {Provider} from 'react-redux'
import renderer from 'react-test-renderer'

import Application from '../application'
import {makeMockStore, mockStores} from '../../utils/mock-data'

describe('Container > Application', () => {
  it('renders correctly', () => {
    const mockStore = makeMockStore(mockStores.init)

    // ensure that /api/region is called during first load
    nock('http://mockHost.com/').get('/api/region').reply(200, {})

    const props = {
      // react-router params
      location: {
        pathname: '/'
      },
      params: {}
    }

    // mount component
    const component = renderer.create(
      <Provider store={mockStore}>
        <Application {...props} />
      </Provider>
    )
    // when trying to make a snapshot from mountToJson, I got an out of memory error

    const tree = component.toJSON()
    // assert that application was rendered
    expect(tree).toMatchSnapshot()
  })
})
