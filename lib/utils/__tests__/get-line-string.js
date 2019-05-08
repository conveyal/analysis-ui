//
import nock from 'nock'

import getLineString from '../get-line-string'

const mockResponse = {
  paths: [
    {
      points:
        'wwrlFhh`uM?fCJzNDrALz@t@rDNrAdBvRc\\tF{K~@m@{Ic@uC{@gF]_A]k@aJgK}DwBaAs@i@c@_CeC'
    }
  ]
}

describe('Utils > GetLineString', () => {
  it('should return a line string', async () => {
    const start = [-70, 40]
    const end = [-70.01, 40]
    expect(await getLineString(start, end, {followRoad: false})).toEqual({
      coordinates: [[-70, 40], [-70.01, 40]],
      type: 'LineString'
    })

    nock('https://graphhopper.com')
      .get('/api/1/route')
      .query(true)
      .reply(200, mockResponse)

    expect(
      (await getLineString(start, end, {followRoad: true})).coordinates
    ).toHaveLength(22)
  })
})
