import lineDistance from '@turf/line-distance'
import {createSelector} from 'reselect'

import selectSegments from './segments'

export default createSelector(selectSegments, (segments = []) =>
  segments.map(
    s =>
      s.geometry.type === 'Point' ? 0 : lineDistance(s.geometry, 'kilometers')
  )
)
