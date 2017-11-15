// @flow
import nock from 'nock'
import React from 'react'

import {
  mockModification,
  mockStores,
  mockWithProvider
} from '../../utils/mock-data'
import ModificationEditor from '../modification-editor'

// Parameters that the Editor would get from the Router
const params = {
  modificationId: mockModification._id,
  projectId: mockModification.projectId
}

const {describe, expect, it} = global
describe('Container > Modification Editor', () => {
  it('renders correctly', () => {
    const {snapshot} = mockWithProvider(<ModificationEditor params={params} />)
    expect(snapshot()).toMatchSnapshot()
  })

  it('renders and can change the name', done => {
    // ensure that /api/region is called during first load
    const putMock = nock('http://mockhost.com')
      .put(`/api/modification/${mockModification._id}`)
      .times(1)
      .reply(200, {})

    // mount component
    const {
      store,
      wrapper
    } = mockWithProvider(<ModificationEditor params={params} />)

    wrapper
      .find('a[name="Edit modification name"]')
      .simulate('click')

    wrapper
      .find('input[name="Modification Name"]')
      .simulate('change', {currentTarget: {value: 'New Modification Name'}})

    setTimeout(() => {
      expect(store.getActions()).toMatchSnapshot()
      expect(putMock.isDone()).toBeTruthy()
      done()
    }, 0)
  })

  it('render just the title if not loaded', () => {
    const init = {...mockStores.init}
    init.project = {feeds: [], feedsById: {}, ...init.project}
    const {snapshot} = mockWithProvider(<ModificationEditor params={params} />, init)
    expect(snapshot()).toMatchSnapshot()
  })
})
