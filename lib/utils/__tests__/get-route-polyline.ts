import lonlat from '@conveyal/lonlat'
import {expect} from '@jest/globals'
import nock from 'nock'

import getRoutePolyline, {BASE_URL, PATH} from '../get-route-polyline'

const mockResponse = {routes: [{geometry: 'kkmlFpdguMzE?ApLsVC?{ChAaC'}]}

test('utils/get-route-polyline', () => {
  const start = [-77.046653, 38.9037355]
  const end = [-77.0472891, 38.9061446]
  const coordinates = encodeURIComponent(
    `${lonlat.toString(start)};${lonlat.toString(end)}`
  )
  nock(BASE_URL)
    .defaultReplyHeaders({'access-control-allow-origin': '*'})
    .get(`${PATH}/${coordinates}.json`)
    .query(true)
    .reply(200, mockResponse)

  return getRoutePolyline(start, end).then((polyline) => {
    expect(polyline.coordinates).toHaveLength(8)
    expect(polyline.coordinates[1]).toEqual([-77.04665, 38.90374])
  })
})
