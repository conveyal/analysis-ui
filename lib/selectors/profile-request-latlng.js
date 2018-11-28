// @flow
import lonlat from '@conveyal/lonlat'
import {createSelector} from 'reselect'

import selectAnalysisBounds from './analysis-bounds'
import selectProfileRequest from './profile-request'

export default createSelector(
  selectAnalysisBounds,
  selectProfileRequest,
  (bounds, pr) => {
    if (pr.fromLon && pr.fromLat) {
      const ll = lonlat.toLeaflet([pr.fromLon, pr.fromLat])
      if (bounds.contains(ll)) return ll
    }
    return bounds.getCenter()
  }
)
