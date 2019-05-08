//
import nock from 'nock'

import * as modifications from '../modifications'
import {
  mockStores,
  makeMockStore,
  mockModification
} from '../../utils/mock-data'

const store = makeMockStore(mockStores.init)

describe('actions > modifications >', () => {
  it('copyFromProject should work', () => {
    nock('http://mockhost.com/')
      .post('/api/project/2/import/1')
      .reply(200, [mockModification])

    const copy = modifications.copyFromProject({
      fromProjectId: '1',
      regionId: '1',
      toProjectId: '2'
    })
    const copyResult = store.dispatch(copy)

    return copyResult[1].then(fetchResult => {
      // Expect the fetch result to contain a "create modifications" action
      expect(fetchResult).toHaveProperty([1, 0, 'type'], 'create modifications')
    })
  })

  it('create should work', () => {
    nock('http://mockhost.com/')
      .post('/api/modification')
      .reply(200, mockModification)

    const create = modifications.create({
      name: 'Add Trip Pattern',
      type: 'add-trip-pattern'
    })
    const createResult = store.dispatch(create)

    return createResult[1].then(fetchResult => {
      expect(fetchResult).toHaveProperty([1, 0, 'type'], 'create modification')
    })
  })

  it('deleteModification should work', () => {
    nock('http://mockhost.com/')
      .delete('/api/modification/1')
      .reply(200, 'deleted')

    const del = modifications.deleteModification('1')
    const deleteResult = store.dispatch(del)
    expect(deleteResult).toHaveLength(3)
    expect(deleteResult).toHaveProperty([0, 'type'], 'delete modification')

    // Call to ensure that there is no error
    return deleteResult[1][1].then(fetchResult => {
      // Follow up action is only a fetch decrement
      expect(fetchResult).toHaveLength(1)
    })
  })

  it('getForProject should work', () => {
    nock('http://mockhost.com/')
      .get('/api/project/1/modifications')
      .reply(200, [mockModification])
      .get(/^\/api\/graphql/)
      .reply(200)

    const get = modifications.getForProject({
      bundleId: '1',
      projectId: '1'
    })
    const getResult = store.dispatch(get)
    return getResult[1].then(fetchResult => {
      expect(fetchResult).toHaveProperty([1, 0, 'type'], 'set modifications')
    })
  })

  it('saveToServer should work', () => {
    nock('http://mockhost.com')
      .put('/api/modification/1234')
      .reply(200, {
        nonce: 'nonce'
      })

    const save = modifications.saveToServer(mockModification)
    const saveResult = store.dispatch(save)

    return saveResult[1].then(fetchResult => {
      expect(fetchResult).toHaveProperty([1, 'type'], 'update modification')
    })
  })

  it('setActive should work', () => {
    expect(modifications.setActive()).toHaveProperty(
      'type',
      'set active modification'
    )
  })

  it('setLocally should work', () => {
    expect(modifications.setLocally()).toHaveProperty(
      'type',
      'set modification'
    )
  })
})
