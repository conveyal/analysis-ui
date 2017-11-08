// @flow

import {mount} from 'enzyme'
import {mountToJson} from 'enzyme-to-json'
import React from 'react'
import {Provider} from 'react-redux'
import {createMemoryHistory} from 'react-router'
import {syncHistoryWithStore} from 'react-router-redux'

import Routes from '../routes'
import {makeMockStore, mockStores} from '../utils/mock-data'

const {describe, expect, it} = global

describe('Routes', function () {
  it('should render', function () {
    const store = makeMockStore(mockStores.init)
    const component = mount(
      <Provider store={store}>
        <Routes
          history={syncHistoryWithStore(createMemoryHistory('/'), store)}
          store={store}
        />
      </Provider>
    )
    expect(mountToJson(component)).toMatchSnapshot()
  })
})
