/* global describe, expect, it, jasmine */

jasmine.DEFAULT_TIMEOUT_INTERVAL *= 10

describe('Container > Edit Project', () => {
  const {mount} = require('enzyme')
  const nock = require('nock')
  const React = require('react')
  const {Provider} = require('react-redux')
  const {makeMockStore, mockStores} = require('../../utils/mock-data')

  it('renders correctly', (done) => {
    const EditProject = require('../edit-project')
    const mockStore = makeMockStore(mockStores.init)

    const postNock = nock('http://mockhost.com')
      .post(`/api/project`)
      .reply(200)

    // mount component
    const wrapper = mount(
      <Provider store={mockStore}>
        <EditProject
          params={{}}
          />
      </Provider>
    )

    wrapper
      .find('input[name="Project Name"]')
      .simulate('change', {target: {value: 'New Project Name'}})

    wrapper
      .find('a[name="Save Project"]')
      .simulate('click')

    setTimeout(() => {
      expect(postNock.isDone()).toBeTruthy()
      done()
    }, 0)
  })
})
