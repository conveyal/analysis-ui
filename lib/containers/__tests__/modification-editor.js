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
    wrapper.unmount()
  })

  it('render just the title if not loaded', () => {
    const init = {...mockStores.init}
    init.project = {...init.project, feeds: [], feedsById: {}}
    const {wrapper} = mockWithProvider(
      <ModificationEditor params={params} />,
      init
    )
    // Should contain "Clear selected bundle" text
    expect(wrapper.find('Dock').children()).toMatchSnapshot()
    wrapper.unmount()
  })
})
