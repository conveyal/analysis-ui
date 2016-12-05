/* global describe, expect, it */

describe('Container > Modification Editor', () => {
  const {mount} = require('enzyme')
  const nock = require('nock')
  const React = require('react')
  const {Provider} = require('react-redux')
  const {makeMockStore, mockModification, mockStores} = require('../../utils/mock-data')

  it('renders correctly', (done) => {
    const ModificationEditor = require('../modification-editor')
    const mockStore = makeMockStore(mockStores.init)

    // ensure that /api/project is called during first load
    const putMock = nock('http://mockhost.com')
      .put(`/api/modification/${mockModification.id}`)
      .reply(200, {})

    const graphqlNock = nock('http://mockhost.com')
      .get('/api/graphql')
      .query(true)
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

    setTimeout(() => {
      expect(mockStore.getActions()).toMatchSnapshot()
      expect(putMock.isDone()).toBeTruthy()
      expect(graphqlNock.isDone()).toBeTruthy()
      done()
    }, 0)
  })
})
