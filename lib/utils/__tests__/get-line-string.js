import getLineString from '../get-line-string'

// Follow road functionally is tested in get-route-polyline test
test('should return a line string', async () => {
  const start = [-70, 40]
  const end = [-70.01, 40]
  expect(await getLineString(start, end, {followRoad: false})).toEqual({
    coordinates: [[-70, 40], [-70.01, 40]],
    type: 'LineString'
  })
})
