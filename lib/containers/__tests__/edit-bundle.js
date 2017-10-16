/* global describe, expect, it */

describe('Container > Edit Bundle', () => {
  const {mount} = require('enzyme')
  const {mountToJson} = require('enzyme-to-json')
  // const nock = require('nock')
  const React = require('react')
  const {Provider} = require('react-redux')
  const {makeMockStore, mockStores} = require('../../utils/mock-data')

  it('renders correctly', () => {
    const EditBundle = require('../edit-bundle')
    const mockStore = makeMockStore(mockStores.init)

    // const postNock = nock('http://mockhost.com').post(`/api/bundle`).reply(200)

    // mount component
    const wrapper = mount(
      <Provider store={mockStore}>
        <EditBundle params={{
          bundleId: '1'
        }} />
      </Provider>
    )

    expect(mountToJson(wrapper)).toMatchSnapshot()
  })
})
