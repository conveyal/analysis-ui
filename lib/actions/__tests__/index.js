/* global describe, expect, it */

describe('actions > index', () => {
  const nock = require('nock')
  const actions = require('../')

  describe('> bundle', () => {
    it('addBundle should work', () => {
      expect(actions.addBundle()).toMatchSnapshot()
    })

    it('deleteBundle should work', async () => {
      nock('http://mockHost.com/')
        .delete('/api/bundle/1')
        .reply(200, 'deleted')

      const deleteResult = actions.deleteBundle(1)

      // expect to receive delete bundle locally action
      expect(deleteResult[0]).toMatchSnapshot()

      // expect to receive increment action while making delete request
      expect(deleteResult[1][0]).toMatchSnapshot()

      // perform deletion
      const deleteRequestResult = await deleteResult[1][1]

      // expect to receive decrement action upon fulfillment of delete request
      expect(deleteRequestResult).toMatchSnapshot()
    })

    it('saveBundle should work', async () => {
      nock('http://mockHost.com/')
        .put('/api/bundle/1')
        .reply(200, 'saved')

      const saveResult = actions.saveBundle({ id: 1 })

      // expect to receive save bundle locally action
      expect(saveResult[0]).toMatchSnapshot()

      // expect to receive increment action while making save request
      expect(saveResult[1][0]).toMatchSnapshot()

      // perform request
      const requestResult = await saveResult[1][1]

      // expect to receive decrement action upon fulfillment of save request
      expect(requestResult).toMatchSnapshot()
    })

    it('setBundle should work', () => {
      expect(actions.setBundle()).toMatchSnapshot()
    })

    it('setBundles should work', () => {
      expect(actions.setBundles()).toMatchSnapshot()
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

  describe('> map state', () => {
    it('setActiveTrips should work', () => {
      expect(actions.setActiveTrips()).toMatchSnapshot()
    })

    it('setMapState should work', () => {
      expect(actions.setMapState()).toMatchSnapshot()
    })

    it('setUser should work', () => {
      expect(actions.setUser()).toMatchSnapshot()
    })
  })
})
