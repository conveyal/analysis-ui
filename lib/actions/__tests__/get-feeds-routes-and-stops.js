//

import nock from 'nock'

import {REROUTE} from '../../constants'
import getFeedsRoutesAndStops from '../get-feeds-routes-and-stops'
import {makeMockStore, mockModification} from '../../utils/mock-data'

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

  it('should work when fetching via getAllRoutesAndStops', async () => {
    nock('http://mockhost.com/')
      .get(/^\/api\/graphql/)
      .reply(200, mockResponse)

    const store = makeMockStore()
    const get = getFeedsRoutesAndStops({bundleId: '1'})
    expect(get).toMatchSnapshot()
    const getResult = store.dispatch(get)
    expect(getResult).toMatchSnapshot()
    const fetchResult = await getResult[1]
    expect(fetchResult).toMatchSnapshot()
  })

  it('should work when fetching with getUnfetchedRoutes', async () => {
    // make request again, forcing fetching via getUnfetchedRoutes
    nock('http://mockhost.com/')
      .get(/^\/api\/graphql/)
      .reply(200, mockResponse)

    const store = makeMockStore()
    const get = getFeedsRoutesAndStops(unfetchedActionParams)
    expect(get).toMatchSnapshot()
    const getResult = store.dispatch(get)
    expect(getResult).toMatchSnapshot()
    const fetchResult = await getResult[1]
    expect(fetchResult).toMatchSnapshot()
  })

  it('should lock ui when no bundles are returned', async () => {
    // make request again, forcing fetching via getUnfetchedRoutes
    nock('http://mockhost.com/')
      .get(/^\/api\/graphql/)
      .reply(200, {bundle: []})

    const store = makeMockStore()
    const get = getFeedsRoutesAndStops(unfetchedActionParams)
    const getResult = store.dispatch(get)
    const fetchResult = await getResult[1]

    expect(get).toMatchSnapshot()
    expect(getResult).toMatchSnapshot()
    expect(fetchResult).toMatchSnapshot()
  })
})
