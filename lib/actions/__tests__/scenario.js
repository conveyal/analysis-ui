// @flow

import nock from 'nock'

import * as scenario from '../scenario'
import {makeMockStore, mockScenario} from '../../utils/mock-data'

describe('actions > scenario', () => {
  it('create should work', async () => {
    nock('http://mockHost.com/').post('/api/scenario').reply(200, {_id: '1'})

    const action = scenario.create({
      bundleId: '1',
      name: 'test',
      projectId: '1'
    })
    const store = makeMockStore()
    const actionResult = store.dispatch(action)
    const fetchResult = await actionResult[1]

    delete action.payload.options.body._id
    expect(action).toMatchSnapshot()
    expect(actionResult).toMatchSnapshot()
    expect(fetchResult).toMatchSnapshot()
  })

  it('deleteScenario should work', async () => {
    nock('http://mockHost.com/').delete('/api/scenario/1').reply(200, 'deleted')

    const action = scenario.deleteScenario('1')
    const store = makeMockStore()
    expect(action).toMatchSnapshot()
    const actionResult = store.dispatch(action)
    expect(actionResult).toMatchSnapshot()
    const fetchResult = await actionResult[1]
    expect(fetchResult).toMatchSnapshot()
  })

  it('load should work', async () => {
    nock('http://mockHost.com/')
      .get('/api/scenario/1')
      .reply(200, {_id: '1', bundleId: '1'})
      .get('/api/scenario/1/modifications')
      .reply(200)

    const action = scenario.load('1')
    const store = makeMockStore()
    expect(action).toMatchSnapshot()
    const actionResult = store.dispatch(action)
    expect(actionResult).toMatchSnapshot()
    const fetchResult = await actionResult[1]
    expect(fetchResult).toMatchSnapshot()
  })

  it('saveToServer should work', async () => {
    nock('http://mockHost.com/').put('/api/scenario/1').reply(200, {_id: '1'})

    const action = scenario.saveToServer(mockScenario)
    const store = makeMockStore()
    expect(action).toMatchSnapshot()
    const actionResult = store.dispatch(action)
    expect(actionResult).toMatchSnapshot()
    const fetchResult = await actionResult[1]
    expect(fetchResult).toMatchSnapshot()
  })

  it('set should work', () => {
    expect(scenario.set()).toMatchSnapshot()
  })

  it('setAll should work', () => {
    expect(scenario.setAll()).toMatchSnapshot()
  })

  it('showVariant should work', () => {
    expect(scenario.showVariant()).toMatchSnapshot()
  })
})
