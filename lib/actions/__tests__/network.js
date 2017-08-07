/* global describe, expect, it, jest */

describe('actions > network', () => {
  const nock = require('nock')
  const network = require('../network')

  it('decrementOutstandingRequests should work', () => {
    expect(network.decrementOutstandingRequests()).toMatchSnapshot()
  })

  it('incrementOutstandingRequests should work', () => {
    expect(network.incrementOutstandingRequests()).toMatchSnapshot()
  })

  describe('> serverAction', () => {
    it('should process successful request', async () => {
      nock('http://mockHost.com/')
        .get('/mockPath')
        .reply(200, 'success')

      const nextFn = jest.fn()
      const onErrorFn = jest.fn()
      const actionResult = network.serverAction({
        next: nextFn,
        onError: onErrorFn,
        options: {},
        url: '/mockPath'
      })

      // expect incrementOutstandingRequests action
      expect(actionResult[0]).toMatchSnapshot()

      // get response
      const response = await actionResult[1]

      // expect to receive array of actions
      // - decrementOutstandingRequests
      // - call to nextFn
      expect(response[0]).toMatchSnapshot()
      expect(nextFn).toHaveBeenCalled()

      // onError should not have been called
      expect(onErrorFn).not.toHaveBeenCalled()
    })

    it('should handle unsuccessful request when onError is provided', async () => {
      nock('http://mockHost.com/')
        .get('/mockPath')
        .reply(500, 'error')

      const nextFn = jest.fn()
      const onErrorFn = jest.fn()
      const actionResult = network.serverAction({
        next: nextFn,
        onError: onErrorFn,
        options: {},
        url: '/mockPath'
      })

      // expect incrementOutstandingRequests action
      expect(actionResult[0]).toMatchSnapshot()

      // get response
      const response = await actionResult[1]

      // expect to receive array of actions
      // - decrementOutstandingRequests
      // - call to onErrorFn
      expect(response[0]).toMatchSnapshot()
      expect(onErrorFn).toHaveBeenCalled()

      // next should not have been called
      expect(nextFn).not.toHaveBeenCalled()
    })

    it('should handle unsuccessful request when onError is not provided', async () => {
      nock('http://mockHost.com/')
        .get('/mockPath')
        .reply(500, 'error')

      const nextFn = jest.fn()
      const actionResult = network.serverAction({
        next: nextFn,
        options: {},
        url: '/mockPath'
      })

      // expect incrementOutstandingRequests action
      expect(actionResult[0]).toMatchSnapshot()

      // get response
      const response = await actionResult[1]

      // expect to receive array of actions
      // - decrementOutstandingRequests
      // - lockUiWithError
      expect(response).toMatchSnapshot()

      // next should not have been called
      expect(nextFn).not.toHaveBeenCalled()
    })
  })
})
