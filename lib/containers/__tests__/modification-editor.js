/* global describe, expect, it */

import {mount} from 'enzyme'
import {mountToJson} from 'enzyme-to-json'
import nock from 'nock'
import React from 'react'
import {Provider} from 'react-redux'

import {
  makeMockStore,
  mockModification,
  mockStores
} from '../../utils/mock-data'
import ModificationEditor from '../modification-editor'

describe('Container > Modification Editor', () => {
  it('renders correctly', done => {
    const mockStore = makeMockStore(mockStores.init)
    // ensure that /api/project is called during first load
    const putMock = nock('http://mockhost.com')
      .put(`/api/modification/${mockModification.id}`)
      .reply(200, {})

    // mount component
    const wrapper = mount(
      <Provider store={mockStore}>
        <ModificationEditor bundleId='' modification={mockModification} />
      </Provider>
    )

    wrapper
      .find('input[name="Modification Name"]')
      .simulate('change', {currentTarget: {value: 'New Modification Name'}})

    setTimeout(() => {
      expect(mockStore.getActions()).toMatchSnapshot()
      expect(putMock.isDone()).toBeTruthy()
      expect(mountToJson(wrapper)).toMatchSnapshot()
      done()
    }, 0)
  })

  it('render just the title if not loaded', () => {
    const init = {...mockStores.init}
    init.scenario = {feeds: [], feedsById: {}, ...init.scenario}
    const mockStore = makeMockStore(init)
    const tree = mount(
      <Provider store={mockStore}>
        <ModificationEditor bundleId='' modification={mockModification} />
      </Provider>
    )
    expect(mountToJson(tree)).toMatchSnapshot()
  })

  it('render the description if present', () => {
    const init = {...mockStores.init}
    init.scenario = {feeds: [], feedsById: {}, ...init.scenario}
    const mockStore = makeMockStore(init)
    const tree = mount(
      <Provider store={mockStore}>
        <ModificationEditor
          bundleId=''
          modification={{...mockModification, description: 'xyzzy'}}
        />
      </Provider>
    )
    expect(mountToJson(tree)).toMatchSnapshot()
  })
})
