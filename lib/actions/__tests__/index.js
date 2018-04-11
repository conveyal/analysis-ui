// @flow

import nock from 'nock'

import * as actions from '../'
import {makeMockStore, mockBundle} from '../../utils/mock-data'

describe('actions > index', () => {
  describe('> bundle', () => {
    it('addBundle should work', () => {
      expect(actions.addBundle()).toMatchSnapshot()
    })

    it('deleteBundle should work', async () => {
      nock('http://mockHost.com/').delete('/api/bundle/1').reply(200, 'deleted')

      const store = makeMockStore()
      const del = actions.deleteBundle('1')
      expect(del).toMatchSnapshot()
      const deleteResult = store.dispatch(del)
      expect(deleteResult).toMatchSnapshot()
      const fetchResult = await deleteResult[1]
      expect(fetchResult).toMatchSnapshot()
    })

    it('saveBundle should work', async () => {
      nock('http://mockHost.com/').put('/api/bundle/1').reply(200, 'saved')

      const store = makeMockStore()
      const save = actions.saveBundle(mockBundle)
      expect(save).toMatchSnapshot()
      const saveResult = store.dispatch(save)
      expect(saveResult).toMatchSnapshot()
      const fetchResult = await saveResult[1]
      expect(fetchResult).toMatchSnapshot()
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

    it('logout should work', () => {
      expect(actions.logout()).toMatchSnapshot()
    })
  })

  describe('> user', () => {
    it('setActiveTrips should work', () => {
      expect(actions.setActiveTrips()).toMatchSnapshot()
    })

    it('setUser should work', () => {
      expect(actions.setUser()).toMatchSnapshot()
    })
  })
})
