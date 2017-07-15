/** Aggregate accessibility for the comparison regional analysis */

import {createSelector} from 'reselect'
import {getAggregateAccessibility} from './aggregate-accessibility'

export default createSelector(
  state => state.analysis.regional.comparisonGrid,
  // mask and weights don't vary between base and comparison
  state => state.analysis.regional.mask,
  state => state.analysis.regional.maskWeights,
  getAggregateAccessibility
)
