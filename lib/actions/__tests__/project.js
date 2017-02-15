/* global describe, expect, it */

describe('actions > project', () => {
  const nock = require('nock')
  const project = require('../project')
  const {makeMockStore, mockProject} = require('../../utils/mock-data')

  it('create should work', async () => {
    nock('http://mockhost.com/')
      .post('/api/project')
      .reply(200)

    const store = makeMockStore()
    const create = project.create(mockProject)
    create.payload.options.body.id = 1
    const createResult = store.dispatch(create)
    const fetchResult = await createResult[1]

    expect(create).toMatchSnapshot()
    expect(createResult).toMatchSnapshot()
    expect(fetchResult).toMatchSnapshot()
  })

  it('deleteProject should work', async () => {
    nock('http://mockHost.com/')
      .delete('/api/project/1')
      .reply(200)

    const store = makeMockStore()
    const action = project.deleteProject('1')
    expect(action).toMatchSnapshot()
    const actionResult = store.dispatch(action)
    expect(actionResult).toMatchSnapshot()
    const fetchResult = await actionResult[1]
    expect(fetchResult).toMatchSnapshot()
  })

  it('load should work', async () => {
    const mockProject = {
      bounds: {
        east: -76.81503295898438,
        north: 39.02345139405932,
        south: 38.777640223073355,
        west: -77.25723266601562
      },
      description: 'Project description',
      name: 'Project name'
    }

    nock('http://mockHost.com/')
      .get('/api/project/1')
      .reply(200, mockProject)

    const store = makeMockStore()
    const action = project.load('1')
    expect(action).toMatchSnapshot()
    const actionResult = store.dispatch(action)
    expect(actionResult).toMatchSnapshot()
    const fetchResult = await actionResult[1]
    expect(fetchResult).toMatchSnapshot()
  })

  it('loadAll should work', async () => {
    nock('http://mockHost.com/')
      .get('/api/project')
      .reply(200, [])

    const store = makeMockStore()
    const action = project.loadAll()
    expect(action).toMatchSnapshot()
    const actionResult = store.dispatch(action)
    expect(actionResult).toMatchSnapshot()
    const fetchResult = await actionResult[1]
    expect(fetchResult).toMatchSnapshot()
  })

  it('save should work', async () => {
    nock('http://mockHost.com/')
      .put('/api/project/1')
      .reply(200, 'saved')

    const store = makeMockStore()
    const action = project.save({ id: '1' })
    expect(action).toMatchSnapshot()
    const actionResult = store.dispatch(action)
    expect(actionResult).toMatchSnapshot()
    const fetchResult = await actionResult[1]
    expect(fetchResult).toMatchSnapshot()
  })

  it('setAll should work', () => {
    expect(project.setAll()).toMatchSnapshot()
  })
})
