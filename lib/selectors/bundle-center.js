// @flow
import {createSelector} from 'reselect'

export default createSelector(
  state => state.scenario.currentBundle,
  bundle => (bundle ? {lon: bundle.centerLon, lat: bundle.centerLat} : null)
)
