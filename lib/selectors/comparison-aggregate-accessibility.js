//
import {createSelector} from 'reselect'

import {activeOpportunityDatasetGrid} from '../modules/opportunity-datasets/selectors'
import getAggregateAccessibility from '../utils/aggregate-accessibility'

/** Aggregate accessibility for the comparison regional analysis */
export default createSelector(
  state => state.analysis.regional.comparisonGrid,
  // aggregation area and weights don't vary between base and comparison
  state => state.analysis.regional.aggregationArea,
  activeOpportunityDatasetGrid,
  getAggregateAccessibility
)
