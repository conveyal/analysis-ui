// @flow
import {createSelector} from 'reselect'

import selectCurrentBundle from './current-bundle'

export default createSelector(
  selectCurrentBundle,
  bundle => (bundle ? {lon: bundle.centerLon, lat: bundle.centerLat} : null)
)
