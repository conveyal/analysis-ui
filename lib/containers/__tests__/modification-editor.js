/* global describe, expect, it */

describe('Container > Modification Editor', () => {
  const {mount} = require('enzyme')
  const nock = require('nock')
  const React = require('react')
  const {Provider} = require('react-redux')
  const {makeMockStore, mockModification, mockStores} = require('../../utils/mock-data')

  it('renders correctly', () => {
    const ModificationEditor = require('../modification-editor')
    const mockStore = makeMockStore(mockStores.init)

    // ensure that /api/project is called during first load
    nock('http://mockhost.com/')
      .get('/api/modification')
      .reply(200, {})

    // mount component
    const wrapper = mount(
      <Provider store={mockStore}>
        <ModificationEditor
          modification={mockModification}
          />
      </Provider>
    )

    wrapper
      .find('input[name="Modification Name"]')
      .simulate('change', {target: {value: 'New Modification Name'}})

    expect(mockStore.getActions()).toMatchSnapshot()
  })
})
