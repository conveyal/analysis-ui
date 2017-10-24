// @flow
import {createSelector} from 'reselect'
import {computeAccessibility} from './accessibility'

import OpportunityDatasets from '../modules/opportunity-datasets'

/**
 * Select comparison surface accessibility
 */
export default createSelector(
  state => state.analysis.comparisonTravelTimeSurface,
  state => state.analysis.isochroneCutoff,
  OpportunityDatasets.selectors.selectActiveOpportunityDatasetGrid,
  computeAccessibility
)
