/* global describe, expect, it */

describe('actions > project', () => {
  const nock = require('nock')
  const project = require('../project')

  it('create should work', () => {
    const createResult = project.create()

    // expect id to exist, then delete to allow for snapshotting
    const createdProject = createResult[0]
    expect(createdProject.payload.id).toMatch(/[-\w]*/)
    delete createdProject.payload.id
    expect(createdProject).toMatchSnapshot()

    // expect a react router action, but delete the id
    const routeAction = createResult[1]
    expect(routeAction.payload.args[0]).toMatch(/\/projects\/[-\w]*\/create/)
    routeAction.payload.args.pop()
    expect(routeAction).toMatchSnapshot()
  })

  it('deleteProject should work', async () => {
    nock('http://mockHost.com/')
      .delete('/api/project/1')
      .reply(200)

    const deleteResult = project.deleteProject('1')

    // expect to receive increment action while making request
    expect(deleteResult[0]).toMatchSnapshot()

    // perform request
    const fetchResult = await deleteResult[1]

    // expect to receive decrement action upon fulfillment of request
    expect(fetchResult[0]).toMatchSnapshot()

    // parse response
    const parseResult = await fetchResult[1]

    // should receive an array of actions
    // - delete project
    // - react router action to go to home
    expect(parseResult).toMatchSnapshot()
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

    const loadResult = project.load('1')

    // expect to receive increment action while making request
    expect(loadResult[0]).toMatchSnapshot()

    // perform request
    const fetchResult = await loadResult[1]

    // expect to receive decrement action upon fulfillment of request
    expect(fetchResult[0]).toMatchSnapshot()

    // parse response
    const parseResult = await fetchResult[1]

    // should receive an array of actions
    // - setLocally
    // - map.setCenter
    // - index.setBundles
    // - scenario.setScenarios
    expect(parseResult).toMatchSnapshot()
  })

  it('loadAll should work', async () => {
    nock('http://mockHost.com/')
      .get('/api/project')
      .reply(200, [])

    const loadResult = project.loadAll()

    // expect to receive increment action while making request
    expect(loadResult[0]).toMatchSnapshot()

    // perform request
    const fetchResult = await loadResult[1]

    // expect to receive decrement action upon fulfillment of request
    expect(fetchResult[0]).toMatchSnapshot()

    // parse response
    const parseResult = await fetchResult[1]

    // should receive an setAll action
    expect(parseResult).toMatchSnapshot()
  })

  it('save should work', async () => {
    nock('http://mockHost.com/')
      .put('/api/project/1')
      .reply(200, 'saved')

    const saveResult = project.save({ id: '1' })

    // expect setLocally action
    expect(saveResult[0]).toMatchSnapshot()

    // expect to receive increment action while making request
    expect(saveResult[1][0]).toMatchSnapshot()

    // perform request
    const fetchResult = await saveResult[1][1]

    // expect to receive a single decrement action upon fulfillment of request
    expect(fetchResult).toMatchSnapshot()
  })

  it('setAll should work', () => {
    expect(project.setAll()).toMatchSnapshot()
  })
})
