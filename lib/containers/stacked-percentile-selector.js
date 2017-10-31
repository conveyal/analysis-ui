// @flow
import {connect} from 'react-redux'

import {setIsochroneCutoff} from '../actions/analysis'
import StackedPercentileSelector
  from '../components/analysis/stacked-percentile-selector'
import selectAccessibility from '../selectors/accessibility'
import selectComparisonAccessibility
  from '../selectors/comparison-accessibility'
import selectMaxAccessibility from '../selectors/max-accessibility'
import selectPercentileCurves from '../selectors/percentile-curves'
import selectComparisonPercentileCurves
  from '../selectors/comparison-percentile-curves'
import selectComparisonInProgress from '../selectors/comparison-in-progress'
import selectComparisonScenario from '../selectors/comparison-scenario'
import messages from '../utils/messages'

import OpportunityDatasets from '../modules/opportunity-datasets'

function mapStateToProps (state, ownProps) {
  const {analysis, scenario} = state
  const scenarioName = scenario.currentScenario.name
  const variantId = analysis.activeVariant || 0
  const variantName = scenario.currentScenario.variants[variantId]

  const comparisonScenario = selectComparisonScenario(state, ownProps)

  let comparisonScenarioName = null
  if (comparisonScenario) {
    // variant -1 indicates no modifications, just use the raw bundle
    const variantName = analysis.comparisonVariant >= 0
      ? comparisonScenario.variants[analysis.comparisonVariant]
      : messages.analysis.baseline
    comparisonScenarioName = `${comparisonScenario.name}: ${variantName}`
  }

  const activeOpportunityDataset = OpportunityDatasets.selectors.selectActiveOpportunityDataset(state, ownProps)

  return {
    accessibility: selectAccessibility(state, ownProps),
    comparisonAccessibility: selectComparisonAccessibility(state, ownProps),
    comparisonInProgress: selectComparisonInProgress(state, ownProps),
    comparisonPercentileCurves: selectComparisonPercentileCurves(
      state,
      ownProps
    ),
    comparisonScenarioName,
    opportunityDatasetName: activeOpportunityDataset && activeOpportunityDataset.name,
    isFetchingIsochrone: analysis.isFetchingIsochrone,
    isochroneCutoff: analysis.isochroneCutoff || 60,
    percentileCurves: selectPercentileCurves(state, ownProps),
    maxAccessibility: selectMaxAccessibility(state, ownProps),
    scenarioName: `${scenarioName}: ${variantName}`
  }
}

function mapDispatchToProps (dispatch: Dispatch, ownProps) {
  return {
    setIsochroneCutoff: cutoff => dispatch(setIsochroneCutoff(cutoff))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  StackedPercentileSelector
)
