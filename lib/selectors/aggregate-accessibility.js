//
import {createSelector} from 'reselect'

import {activeOpportunityDatasetGrid} from '../modules/opportunity-datasets/selectors'
import getAggregateAccessibility from '../utils/aggregate-accessibility'

/**
 * Selector to compute the weighted average accessibility value from a regional
 * analysis
 */
export default createSelector(
  state => state.analysis.regional.grid,
  state => state.analysis.regional.aggregationArea,
  activeOpportunityDatasetGrid,
  getAggregateAccessibility
)
