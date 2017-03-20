/* global describe, expect, it */

describe.only('actions > modifications >', () => {
  const nock = require('nock')
  const modifications = require('../modifications')
  const {makeMockStore, mockModification} = require('../../utils/mock-data')

  it('copyFromScenario should work', async () => {
    nock('http://mockhost.com/')
      .get('/api/scenario/1/modifications')
      .reply(200, [mockModification])
      .put(/^\/api\/modification/)
      .reply(200, 'saved')

    const store = makeMockStore()
    const copy = modifications.copyFromScenario({
      fromScenarioId: 1,
      toScenarioId: 2,
      variants: [1]
    })
    const copyResult = store.dispatch(copy)
    const fetchResult = await copyResult[1]
    console.log(fetchResult)
    expect(copy).toMatchSnapshot()
    expect(copyResult).toMatchSnapshot()
    delete fetchResult[1][0][0].payload.id
    expect(fetchResult).toMatchSnapshot()
  })

  it('create should work', async () => {
    nock('http://mockhost.com/')
      .post('/api/modification')
      .reply(200, mockModification)

    const store = makeMockStore()
    const create = modifications.create({
      feedId: '1',
      projectId: '1',
      scenarioId: '1',
      type: 'add-trip-pattern',
      variants: []
    })
    create.payload.options.body.id = 1
    const createResult = store.dispatch(create)
    const fetchResult = await createResult[1]

    expect(create).toMatchSnapshot()
    expect(createResult).toMatchSnapshot()
    expect(fetchResult).toMatchSnapshot()
  })

  it('deleteModification should work', async () => {
    nock('http://mockHost.com/')
      .delete('/api/modification/1')
      .reply(200, 'deleted')

    const store = makeMockStore()
    const del = modifications.deleteModification('1')
    expect(del).toMatchSnapshot()
    const deleteResult = store.dispatch(del)
    expect(deleteResult).toMatchSnapshot()
    const fetchResult = await deleteResult[1]
    expect(fetchResult).toMatchSnapshot()
  })

  it('getForScenario should work', async () => {
    nock('http://mockHost.com/')
      .get('/api/scenario/1/modifications')
      .reply(200, [mockModification])
      .get(/^\/api\/graphql/)
      .reply(200)

    const store = makeMockStore()
    const get = modifications.getForScenario({
      bundleId: '1',
      scenarioId: '1'
    })
    expect(get).toMatchSnapshot()
    const getResult = store.dispatch(get)
    expect(getResult).toMatchSnapshot()
    const fetchResult = await getResult[1]
    expect(fetchResult).toMatchSnapshot()
  })

  it('saveToServer should work', async () => {
    nock('http://mockhost.com')
      .put('/api/modification/1234')
      .reply(200, 'saved')

    const store = makeMockStore()
    const save = modifications.saveToServer(mockModification)
    expect(save).toMatchSnapshot()
    const saveResult = store.dispatch(save)
    expect(saveResult).toMatchSnapshot()
    const fetchResult = await saveResult[1]
    expect(fetchResult).toMatchSnapshot()
  })

  it('set should work', async () => {
    nock('http://mockHost.com/')
      .put('/api/modification/1234')
      .reply(200, 'saved')

    const store = makeMockStore()
    const set = modifications.set(mockModification)
    expect(set).toMatchSnapshot()
    const setResult = store.dispatch(set)
    expect(setResult).toMatchSnapshot()
    const fetchResult = await setResult[1]
    expect(fetchResult).toMatchSnapshot()
  })

  it('setActive should work', () => {
    expect(modifications.setActive()).toMatchSnapshot()
  })

  it('setAndRetrieveData should work', async () => {
    const setResult = modifications.setAndRetrieveData({
      bundleId: 1,
      modification: mockModification
    })

    expect(setResult).toMatchSnapshot()
  })

  it('setLocally should work', () => {
    expect(modifications.setLocally()).toMatchSnapshot()
  })
})
