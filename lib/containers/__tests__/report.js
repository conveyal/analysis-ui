/* global describe, expect, it */

describe('Container > Report', () => {
  const nock = require('nock')
  const React = require('react')
  const {Provider} = require('react-redux')
  const renderer = require('react-test-renderer')
  const {makeMockStore, mockProject, mockScenario, mockStores} = require('../../utils/mock-data.js')

  it('renders correctly', () => {
    const Report = require('../report')
    mockStores.init.scenario.variants.push('Mock Variant')
    const mockStore = makeMockStore(mockStores.init)

    // ensure that /api/project is called during first load
    nock('http://mockHost.com/')
      .get('/api/project/1')
      .reply(200, mockProject)
      .get('/api/scenario/1')
      .reply(200, mockScenario)
      .get('/api/scenario/1/modifications')
      .reply(200)

    const props = {
      // react-router params
      params: {
        projectId: '1',
        scenarioId: '1',
        variantId: '0'
      }
    }

    // mount component
    const component = renderer.create(
      <Provider store={mockStore}>
        <Report
          {...props}
          />
      </Provider>
    )
    const tree = component.toJSON()

    // assert that application was rendered
    expect(tree).toMatchSnapshot()

    // ensure that actions were dispatched to load project
    expect(mockStore.getActions().length).toBeGreaterThan(0)
  })
})
