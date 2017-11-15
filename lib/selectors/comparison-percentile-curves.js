// @flow
import {createSelector} from 'reselect'
import {computePercentileCurves} from './percentile-curves'

import OpportunityDatasets from '../modules/opportunity-datasets'

/**
 * Select the percentile curves for the comparison project
 */
export default createSelector(
  state => state.analysis.comparisonTravelTimeSurface,
  OpportunityDatasets.selectors.selectActiveOpportunityDatasetGrid,
  (travelTimeSurface, grid) =>
    (travelTimeSurface && grid
      ? computePercentileCurves({travelTimeSurface, grid})
      : null)
)
