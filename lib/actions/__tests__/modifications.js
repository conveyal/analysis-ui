import nock from 'nock'

import {mockStores, makeMockStore, mockModification} from 'lib/utils/mock-data'

import * as modifications from '../modifications'

const store = makeMockStore(mockStores.init)

describe('actions > modifications >', () => {
  it('copyFromProject should work', () => {
    nock('http://localhost')
      .post('/api/project/2/import/1')
      .reply(200, [mockModification], {Content: 'json'})

    return store
      .dispatch(
        modifications.copyFromProject({
          fromProjectId: '1',
          toProjectId: '2'
        })
      )
      .then((r) => {
        expect(r).toEqual([mockModification])
      })
  })

  it('create should work', () => {
    nock('http://localhost')
      .post('/api/modification')
      .reply(200, mockModification, {Content: 'json'})

    const create = modifications.createModification({
      name: 'Add Trip Pattern',
      type: 'add-trip-pattern'
    })
    return store.dispatch(create).then((m) => {
      expect(m).toEqual(mockModification)
    })
  })

  it('deleteModification should work', () => {
    const scope = nock('http://localhost')
      .delete('/api/modification/1')
      .reply(200, 'deleted')

    const del = modifications.deleteModification('1')
    return store.dispatch(del).then(() => {
      scope.done()
    })
  })

  it('getForProject should work', () => {
    const scope = nock('http://localhost')
      .get('/api/project/1/modifications')
      .reply(200, [mockModification], {Content: 'json'})

    const get = modifications.getForProject('1')
    return store.dispatch(get).then((m) => {
      expect(m).toEqual([mockModification])
      scope.done()
    })
  })

  it('saveToServer should work', () => {
    nock('http://localhost')
      .put('/api/modification/1234')
      .reply(200, {nonce: 'nonce'}, {Content: 'json'})

    const save = modifications.saveToServer(mockModification)
    return store.dispatch(save).then((r) => {
      expect(r.nonce).toBe('nonce')
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
