// @flow
import nock from 'nock'
import * as project from '../project'
import {makeMockStore, mockProject} from '../../utils/mock-data'

const {describe, expect, it} = global
describe('actions > project', () => {
  it('create should work', async () => {
    nock('http://mockHost.com/').post('/api/project').reply(200, {_id: '1'})

    const action = project.create({
      bundleId: '1',
      name: 'test',
      regionId: '1'
    })
    const store = makeMockStore()
    const actionResult = store.dispatch(action)
    const fetchResult = await actionResult[1]

    delete action.payload.options.body._id
    expect(action).toMatchSnapshot()
    expect(actionResult).toMatchSnapshot()
    expect(fetchResult).toMatchSnapshot()
  })

  it('deleteProject should work', async () => {
    nock('http://mockHost.com/').delete('/api/project/1').reply(200, 'deleted')

    const action = project.deleteProject('1')
    const store = makeMockStore()
    expect(action).toMatchSnapshot()
    const actionResult = store.dispatch(action)
    expect(actionResult).toMatchSnapshot()
    const fetchResult = await actionResult[1]
    expect(fetchResult).toMatchSnapshot()
  })

  it('load should work', async () => {
    nock('http://mockHost.com/')
      .get('/api/project/1')
      .reply(200, {_id: '1', bundleId: '1'})
      .get('/api/project/1/modifications')
      .reply(200)

    const action = project.load('1')
    const store = makeMockStore()
    expect(action).toMatchSnapshot()
    const actionResult = store.dispatch(action)
    expect(actionResult).toMatchSnapshot()
    const fetchResult = await actionResult[1]
    expect(fetchResult).toMatchSnapshot()
  })

  it('saveToServer should work', async () => {
    nock('http://mockHost.com/').put('/api/project/1').reply(200, {_id: '1'})

    const action = project.saveToServer(mockProject)
    const store = makeMockStore()
    expect(action).toMatchSnapshot()
    const actionResult = store.dispatch(action)
    expect(actionResult).toMatchSnapshot()
    const fetchResult = await actionResult[1]
    expect(fetchResult).toMatchSnapshot()
  })

  it('set should work', () => {
    expect(project.set()).toMatchSnapshot()
  })

  it('setAll should work', () => {
    expect(project.setAll()).toMatchSnapshot()
  })

  it('showVariant should work', () => {
    expect(project.showVariant()).toMatchSnapshot()
  })
})
