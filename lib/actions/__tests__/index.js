import nock from 'nock'

import {makeMockStore, mockBundle} from 'lib/utils/mock-data'
import * as actions from '../'

describe('actions > index', () => {
  describe('> bundle', () => {
    it('addBundle should work', () => {
      expect(actions.addBundle()).toMatchSnapshot()
    })

    it('deleteBundle should work', () => {
      nock('http://localhost').delete('/api/bundle/1').reply(200)

      const store = makeMockStore()
      return store.dispatch(actions.deleteBundle('1')).then(() => {
        expect(nock.isDone()).toBeTruthy()
        expect(store.getActions()).toHaveLength(3)
      })
    })

    it('saveBundle should work', () => {
      nock('http://localhost')
        .put('/api/bundle/1')
        .reply(200, {_id: '1', nonce: '2'}, {Content: 'json'})

      const store = makeMockStore()
      return store.dispatch(actions.saveBundle(mockBundle)).then(() => {
        expect(nock.isDone()).toBeTruthy()
        expect(store.getActions()).toHaveLength(3)
      })
    })

    it('setBundle should work', () => {
      expect(actions.setBundle()).toMatchSnapshot()
    })
  })

  describe('> feed', () => {
    it('setFeeds should work', () => {
      expect(actions.setFeeds()).toMatchSnapshot()
    })
  })

  describe('> login / logout', () => {
    it('login should work', () => {
      expect(actions.login()).toMatchSnapshot()
    })
  })

  describe('> user', () => {
    it('setUser should work', () => {
      expect(actions.setUser()).toMatchSnapshot()
    })
  })
})
