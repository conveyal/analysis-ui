// @flow
import lonlat from '@conveyal/lonlat'
import {createSelector} from 'reselect'

import selectAnalysisBounds from './analysis-bounds'
import selectProfileRequest from './profile-request'

export default createSelector(
  selectAnalysisBounds,
  selectProfileRequest,
  (bounds, pr) => {
    try {
      const ll = lonlat.toLeaflet([pr.fromLon, pr.fromLat])
      if (bounds.contains(ll)) return ll
    } catch (e) {
      console.error(e)
    }
    return bounds.getCenter()
  }
)
