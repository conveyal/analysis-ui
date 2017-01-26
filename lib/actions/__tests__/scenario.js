/* global describe, expect, it */

describe('actions > scenario', () => {
  const nock = require('nock')
  const scenario = require('../scenario')

  it('create should work', async () => {
    nock('http://mockHost.com/')
      .post('/api/scenario')
      .reply(200, { id: '1' })

    const createResult = scenario.create({
      bundleId: '1',
      name: 'test',
      projectId: '1'
    })

    // expect to receive increment action while making request
    expect(createResult[0]).toMatchSnapshot()

    // perform request
    const fetchResult = await createResult[1]

    // expect to receive decrement action upon fulfillment of request
    expect(fetchResult[0]).toMatchSnapshot()

    // parse response
    const parseResult = await fetchResult[1]

    // should receive an array of actions
    // - addScenario
    // - react router action to go to new scenario
    expect(parseResult).toMatchSnapshot()
  })

  it('deleteScenario should work', async () => {
    nock('http://mockHost.com/')
      .delete('/api/scenario/1')
      .reply(200, 'deleted')

    const deleteResult = scenario.deleteScenario({
      projectId: '1',
      scenarioId: '1'
    })

    // expect to receive increment action while making request
    expect(deleteResult[0]).toMatchSnapshot()

    // perform request
    const fetchResult = await deleteResult[1]

    // expect to receive decrement action upon fulfillment of request
    expect(fetchResult[0]).toMatchSnapshot()

    // parse response
    const parseResult = await fetchResult[1]

    // should receive an array of actions
    // - deleteLocally
    // - react router action to go to certain project
    expect(parseResult).toMatchSnapshot()
  })

  it('load should work', async () => {
    nock('http://mockHost.com/')
      .get('/api/scenario/1')
      .reply(200, { id: '1', bundleId: '1' })
      .get('/api/scenario/1/modifications')
      .reply(200)

    const loadResult = scenario.load('1')

    // expect to receive increment action while making request
    expect(loadResult[0]).toMatchSnapshot()

    // perform request
    const fetchResult = await loadResult[1]

    // expect to receive decrement action upon fulfillment of request
    expect(fetchResult[0]).toMatchSnapshot()

    // parse response
    const parseResult = await fetchResult[1]

    // should receive an array of actions
    // - set
    // - modifications.getForScenario
    expect(parseResult).toMatchSnapshot()

    // don't bother to test getForScenario
    // since it is tested in the modifications file
  })

  it('saveToServer should work', async () => {
    nock('http://mockHost.com/')
      .put('/api/scenario/1')
      .reply(200, { id: '1' })

    const saveResult = scenario.saveToServer({ id: '1' })

    // expect to receive increment action while making request
    expect(saveResult[0]).toMatchSnapshot()

    // perform request
    const fetchResult = await saveResult[1]

    // expect to receive decrement action upon fulfillment of request
    expect(fetchResult[0]).toMatchSnapshot()

    // parse response
    const parseResult = await fetchResult[1]

    // should receive only a set action
    expect(parseResult).toMatchSnapshot()
  })

  it('set should work', () => {
    expect(scenario.set()).toMatchSnapshot()
  })

  it('setAll should work', () => {
    expect(scenario.setAll()).toMatchSnapshot()
  })

  it('setAndLoadModifications should work', async () => {
    nock('http://mockHost.com/')
      .get('/api/scenario/1/modifications')
      .reply(200)

    const loadResult = scenario.setAndLoadModifications({ id: '1', bundleId: '1' })

    // should receive an array of actions
    // - set
    // - modifications.getForScenario
    expect(loadResult).toMatchSnapshot()

    // don't bother to test getForScenario
    // since it is tested in the modifications file
  })

  it('createVariant should work', () => {
    expect(scenario.createVariant()).toMatchSnapshot()
  })

  it('showVariant should work', () => {
    expect(scenario.showVariant()).toMatchSnapshot()
  })

  it('updateVariant should work', () => {
    expect(scenario.updateVariant()).toMatchSnapshot()
  })

  it('updateVariants should work', () => {
    expect(scenario.updateVariants()).toMatchSnapshot()
  })
})
