/* global describe, expect, it */

import nock from 'nock'

import * as modifications from '../modifications'

const mockModification = {
  feed: { id: '1' },
  id: '1',
  routes: [{ id: '1' }],
  stops: [{ id: '1' }],
  trips: [{ id: '1' }],
  variants: ['2']
}

describe('actions > modifications', () => {
  it('copyFromScenario should work', async () => {
    nock('http://mockHost.com/')
      .get('/api/scenario/1/modifications')
      .reply(200, [mockModification])
      .put(/^\/api\/modification/)
      .reply(200, 'saved')

    const copyResult = modifications.copyFromScenario({
      fromScenarioId: 1,
      toScenarioId: 2,
      variants: [1]
    })

    // expect to receive increment action while making request
    expect(copyResult[0]).toMatchSnapshot()

    // perform request
    const fetchResult = await copyResult[1]

    // expect to receive decrement action upon fulfillment of request
    expect(fetchResult[0]).toMatchSnapshot()

    // parse response
    const parseResult = await fetchResult[1]

    // should receive an array of arrays
    expect(parseResult.length).toBe(1)
    expect(parseResult[0].length).toBe(2)

    // assert existance of uuid then delete it for snapshot
    expect(parseResult[0][0].payload.id).toMatch(/[-\w]*/)
    delete parseResult[0][0].payload.id

    // expect parse result to be the result of the set action
    expect(parseResult[0][0]).toMatchSnapshot()

    // expect a set action
    expect(parseResult[0][1]).toMatchSnapshot()

    // don't bother to perform save request
    // since it is tested in another test case in this file
  })

  it('create should work', async () => {
    nock('http://mockHost.com/')
      .post('/api/modification')
      .reply(200, mockModification)

    const createResult = modifications.create({
      feedId: '1',
      projectId: '1',
      scenarioId: '1',
      type: 'add-trip-pattern',
      variants: []
    })

    // expect to receive increment action while making request
    expect(createResult[0]).toMatchSnapshot()

    // perform request
    const fetchResult = await createResult[1]

    // expect to receive decrement action upon fulfillment of request
    expect(fetchResult[0]).toMatchSnapshot()

    // parse response
    const parseResult = await fetchResult[1]

    // expect parseResult to have server response and
    // react route push action
    expect(parseResult).toMatchSnapshot()
  })

  it('deleteModification should work', async () => {
    nock('http://mockHost.com/')
      .delete('/api/modification/1')
      .reply(200, 'deleted')

    const deleteResult = modifications.deleteModification('1')

    // expect to receive delete locally action
    expect(deleteResult[0]).toMatchSnapshot()

    // perform request
    const fetchResult = await deleteResult[1]

    // expect to receive increment action while making request
    expect(fetchResult[0]).toMatchSnapshot()

    // parse response
    const parseResult = await fetchResult[1]

    // expect to receive decrement action upon fulfillment of request
    expect(parseResult).toMatchSnapshot()
  })

  it('getForScenario should work', async () => {
    nock('http://mockHost.com/')
      .get('/api/scenario/1/modifications')
      .reply(200, [mockModification])
      .get(/^\/api\/graphql/)
      .reply(200)

    const getResult = modifications.getForScenario({
      bundleId: '1',
      scenarioId: '1'
    })

    // expect to receive increment action while making request
    expect(getResult[0]).toMatchSnapshot()

    // perform request
    const fetchResult = await getResult[1]

    // expect to receive decrement action upon fulfillment of request
    expect(fetchResult[0]).toMatchSnapshot()

    // parse response
    const parseResult = await fetchResult[1]

    // expect to receive an array with first result being a setAll action
    expect(parseResult[0]).toMatchSnapshot()

    // expect second result being a request to getFeedsRoutesAndStops
    expect(parseResult[1]).toMatchSnapshot()

    // don't bother testing result of getFeedsRoutesAndStops
    // since it is tested in the get-feeds-routes-and-stops file
  })

  it('saveToServer should work', async () => {
    nock('http://mockHost.com/')
      .put('/api/modification/1')
      .reply(200, 'saved')

    const saveResult = modifications.saveToServer(mockModification)

    // expect to receive increment action while making request
    expect(saveResult[0]).toMatchSnapshot()

    // perform request
    const fetchResult = await saveResult[1]

    // expect to receive only decrement action upon fulfillment of request
    expect(fetchResult.length).toBe(1)
    expect(fetchResult[0]).toMatchSnapshot()
  })

  it('set should work', async () => {
    nock('http://mockHost.com/')
      .put('/api/modification/1')
      .reply(200, 'saved')

    const setResult = modifications.set(mockModification)

    // should receive an array of arrays
    expect(setResult.length).toBe(2)

    // expect a setLocally action
    expect(setResult[0]).toMatchSnapshot()

    // expect saveToServer action
    expect(setResult[1]).toMatchSnapshot()

    // don't bother testing result of saveToServer
    // since it is tested in another test case in this file
  })

  it('setActive should work', () => {
    expect(modifications.setActive()).toMatchSnapshot()
  })

  it('setAndRetrieveData should work', async () => {
    nock('http://mockHost.com/')
      .put('/api/modification/1')
      .reply(200, 'saved')
      .get(/^\/api\/graphql/)
      .reply(200)

    const setResult = modifications.setAndRetrieveData({
      bundleId: 1,
      modification: mockModification
    })

    // should receive an array
    expect(setResult.length).toBe(2)

    // expect a set action (array of setLocally and saveToServer)
    expect(setResult[0]).toMatchSnapshot()

    // expect a getFeedsRoutesAndStops action
    expect(setResult[1]).toMatchSnapshot()

    // don't bother testing result of getFeedsRoutesAndStops or saveToServer
    // getFeedsRoutesAndStops is tested in the get-feeds-routes-and-stops file
    // saveToServer is tested in another test case in this file
  })

  it('setLocally should work', () => {
    expect(modifications.setLocally()).toMatchSnapshot()
  })
})
