//
const {describe, expect, it} = global
describe('actions > region', () => {
  const nock = require('nock')
  const region = require('../region')
  const {makeMockStore, mockRegion} = require('../../utils/mock-data')

  it('create should work', async () => {
    nock('http://mockhost.com/')
      .post('/api/region')
      .reply(200, {...mockRegion, _id: 1})

    const store = makeMockStore()
    const create = region.create(mockRegion)
    const createResult = store.dispatch(create)
    const fetchResult = await createResult[1]

    expect(create).toMatchSnapshot()
    expect(createResult).toMatchSnapshot()
    expect(fetchResult).toMatchSnapshot()
  })

  it('deleteRegion should work', async () => {
    nock('http://mockHost.com/')
      .delete('/api/region/1')
      .reply(200)

    const store = makeMockStore()
    const action = region.deleteRegion('1')
    expect(action).toMatchSnapshot()
    const actionResult = store.dispatch(action)
    expect(actionResult).toMatchSnapshot()
    const fetchResult = await actionResult[1]
    expect(fetchResult).toMatchSnapshot()
  })

  it('load should work', async () => {
    const mockRegion = {
      bounds: {
        east: -76.81503295898438,
        north: 39.02345139405932,
        south: 38.777640223073355,
        west: -77.25723266601562
      },
      description: 'Region description',
      name: 'Region name'
    }

    nock('http://mockHost.com/')
      .get('/api/region/1')
      .reply(200, mockRegion)

    const store = makeMockStore()
    const action = region.load('1')
    expect(action).toMatchSnapshot()
    const actionResult = store.dispatch(action)
    expect(actionResult).toMatchSnapshot()
    const fetchResult = await actionResult[1]
    expect(fetchResult).toMatchSnapshot()
  })

  it('loadAll should work', async () => {
    nock('http://mockHost.com/')
      .get('/api/region')
      .reply(200, [])

    const store = makeMockStore()
    const action = region.loadAll()
    expect(action).toMatchSnapshot()
    const actionResult = store.dispatch(action)
    expect(actionResult).toMatchSnapshot()
    const fetchResult = await actionResult[1]
    expect(fetchResult).toMatchSnapshot()
  })

  it('save should work', async () => {
    nock('http://mockHost.com/')
      .put('/api/region/1')
      .reply(200, mockRegion)

    const store = makeMockStore()
    const action = region.save(mockRegion)
    expect(action).toMatchSnapshot()
    const actionResult = store.dispatch(action)
    expect(actionResult).toMatchSnapshot()
    const fetchResult = await actionResult[1]
    expect(fetchResult).toMatchSnapshot()
  })

  it('setAll should work', () => {
    expect(region.setAll()).toMatchSnapshot()
  })
})
