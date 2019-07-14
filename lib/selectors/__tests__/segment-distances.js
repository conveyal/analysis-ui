import selectSegmentDistances from '../segment-distances'

test('should get the distances correctly for the active modifications segments', () => {
  expect(
    selectSegmentDistances({
      project: {
        modifications: [
          {
            _id: '1',
            segments: [
              {
                geometry: {
                  type: 'LineString',
                  coordinates: [[-77, 38], [-77, 39]]
                }
              }
            ]
          }
        ]
      },
      queryString: {
        modificationId: '1'
      }
    }).map(v => v.toFixed(8))
  ).toMatchSnapshot()
})
