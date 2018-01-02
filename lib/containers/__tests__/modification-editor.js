// @flow
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

  it('renders and can change the name', () => {
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

    expect(store.getActions()).toMatchSnapshot()
  })

  it('render just the title if not loaded', () => {
    const init = {...mockStores.init}
    init.project = {feeds: [], feedsById: {}, ...init.project}
    const {snapshot} = mockWithProvider(<ModificationEditor params={params} />, init)
    expect(snapshot()).toMatchSnapshot()
  })
})
