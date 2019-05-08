import lonlat from '@conveyal/lonlat'
import nock from 'nock'

import getRoutePolyline from '../get-route-polyline'

const mockResponse = {
  paths: [
    {
      points:
        'wwrlFhh`uM?fCJzNDrALz@t@rDNrAdBvRc\\tF{K~@m@{Ic@uC{@gF]_A]k@aJgK}DwBaAs@i@c@_CeC'
    }
  ]
}

describe('Utils > GetRoutePolyline', () => {
  it('should get a route polyline', done => {
    const start = [-70, 40]
    const end = [-70.1, 40.1]
    nock('https://graphhopper.com')
      .get('/api/1/route')
      .query(true)
      .reply(200, uri => {
        expect(uri.indexOf(lonlat.toLatFirstString(start)) > -1).toBeTruthy()
        expect(uri.indexOf(lonlat.toLatFirstString(end)) > -1).toBeTruthy()
        return mockResponse
      })

    getRoutePolyline(start, end).then(polyline => {
      expect(polyline).toHaveLength(20)
      expect(polyline[0]).toEqual([-77.01141, 38.93132])
      done()
    })
  })
})
