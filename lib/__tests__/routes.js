// @flow
import enzyme from 'enzyme'
import nock from 'nock'
import React from 'react'
import {Provider} from 'react-redux'
import {createMemoryHistory} from 'react-router'
import {syncHistoryWithStore} from 'react-router-redux'

import Routes from '../routes'
import {makeMockStore, mockStores} from '../utils/mock-data'

const waitImmediate = () => new Promise((resolve) => setImmediate(resolve))

describe('Routes', function () {
  it('should render', async function () {
    const scope = nock('http://mockhost.com')
      .get('/api/region')
      .reply(200, [])

    const store = makeMockStore(mockStores.init)
    const component = enzyme.mount(
      <Provider store={store}>
        <Routes
          history={syncHistoryWithStore(createMemoryHistory('/'), store)}
          store={store}
        />
      </Provider>
    )

    await waitImmediate()

    expect(scope.isDone()).toBeTruthy()

    await waitImmediate()
    expect(component).toMatchSnapshot()
    component.unmount()
  })
})
