// @flow
import lonlat from '@conveyal/lonlat'
import nock from 'nock'
import getRoutePolyline from '../get-route-polyline'

const mockResponse = {'hints':{'visited_nodes.average':'54.0','visited_nodes.sum':'54'},'info':{'copyrights':['GraphHopper','OpenStreetMap contributors'],'took':7},'paths':[{'distance':2428.47,'weight':292.716944,'time':292713,'transfers':0,'points_encoded':true,'bbox':[-77.021372,38.930307,-77.011408,38.941938],'points':'wwrlFhh`uM?fCJzNDrALz@t@rDNrAdBvRc\\tF{K~@m@{Ic@uC{@gF]_A]k@aJgK}DwBaAs@i@c@_CeC','legs':[],'details':{},'ascend':45.04349899291992,'descend':11.224498748779297,'snapped_waypoints':'wwrlFhh`uMiaAdL'}]}

describe('Utils > GetRoutePolyline', () => {
  it('should get a route polyline', (done) => {
    const start = [-70, 40]
    const end = [-70.1, 40.1]
    nock('https://graphhopper.com')
      .get('/api/1/route')
      .query(true)
      .reply(200, (uri, body) => {
        expect(uri.indexOf(lonlat.toLatFirstString(start)) > -1).toBeTruthy()
        expect(uri.indexOf(lonlat.toLatFirstString(end)) > -1).toBeTruthy()
        return mockResponse
      })

    getRoutePolyline(start, end)
      .then(polyline => {
        expect(polyline).toHaveLength(20)
        expect(polyline[0]).toEqual([-77.01141, 38.93132])
        done()
      })
  })
})
