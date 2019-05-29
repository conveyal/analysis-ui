import nock from 'nock'

import {makeMockStore, mockModification} from 'lib/utils/mock-data'
import {REROUTE} from 'lib/constants'

import getFeedsRoutesAndStops from '../get-feeds-routes-and-stops'

describe('actions > getFeedsRoutesAndStops', () => {
  const mockRoutes = [
    {
      route_id: '1',
      route_short_name: '1'
    },
    {
      route_id: '2',
      route_short_name: '2'
    }
  ]

  const mockResponse = {
    bundle: [
      {
        feeds: [
          {
            checksum: 'abcd',
            detailRoutes: mockRoutes,
            feed_id: '1',
            routes: mockRoutes,
            stops: [
              {
                stop_id: '1'
              }
            ]
          }
        ]
      }
    ]
  }

  // add a mock unfetched route so there is a need to fetch
  const mockModificationWithUnfetchedRoute = {
    ...mockModification,
    type: REROUTE
  }

  const unfetchedActionParams = {
    bundleId: '1',
    modifications: [mockModificationWithUnfetchedRoute]
  }

  const mockHeaders = {
    Content: 'json'
  }

  it('should work when fetching via getAllRoutesAndStops', () => {
    nock('http://localhost')
      .get(/^\/api\/graphql/)
      .reply(200, mockResponse, mockHeaders)

    const store = makeMockStore()
    return store.dispatch(getFeedsRoutesAndStops({bundleId: '1'})).then(r => {
      expect(r).toMatchSnapshot()
    })
  })

  it('should work when fetching with getUnfetchedRoutes', () => {
    // make request again, forcing fetching via getUnfetchedRoutes
    nock('http://localhost')
      .get(/^\/api\/graphql/)
      .reply(200, mockResponse, mockHeaders)

    const store = makeMockStore()
    return store
      .dispatch(getFeedsRoutesAndStops(unfetchedActionParams))
      .then(r => {
        expect(r).toMatchSnapshot()
      })
  })

  it('should lock ui when no bundles are returned', () => {
    // make request again, forcing fetching via getUnfetchedRoutes
    nock('http://localhost')
      .get(/^\/api\/graphql/)
      .reply(200, {bundle: []}, mockHeaders)

    const store = makeMockStore()
    const get = getFeedsRoutesAndStops(unfetchedActionParams)
    return store.dispatch(get).then(() => {
      expect(store.getActions()).toMatchSnapshot()
    })
  })
})
