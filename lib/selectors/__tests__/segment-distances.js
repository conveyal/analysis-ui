// @flow

import selectSegmentDistances from '../segment-distances'

describe('Selectors > Segment Distances', () => {
  it('should get the distances correctly for the active modifications segments', () => {
    expect(selectSegmentDistances({
      project: {
        activeModificationId: '1',
        modifications: [{
          _id: '1',
          segments: [{
            geometry: {
              type: 'LineString',
              coordinates: [
                [-77, 38],
                [-77, 39]
              ]
            }
          }]
        }]
      }
    }).map(v => v.toFixed(8))).toMatchSnapshot()
  })
})
