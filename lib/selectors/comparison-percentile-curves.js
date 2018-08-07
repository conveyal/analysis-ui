// @flow
import {createSelector} from 'reselect'
import {computePercentileCurves} from './percentile-curves'

import {activeOpportunityDatasetGrid} from '../modules/opportunity-datasets/selectors'

/**
 * Select the percentile curves for the comparison project
 */
export default createSelector(
  state => state.analysis.comparisonTravelTimeSurface,
  activeOpportunityDatasetGrid,
  (travelTimeSurface, grid) =>
    (travelTimeSurface && grid
      ? computePercentileCurves({travelTimeSurface, grid})
      : null)
)
