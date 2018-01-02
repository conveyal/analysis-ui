// @flow
import {connect} from 'react-redux'

import {setProfileRequest} from '../actions/analysis'
import StackedPercentileSelector
  from '../components/analysis/stacked-percentile-selector'
import * as select from '../selectors'
import messages from '../utils/messages'

import OpportunityDatasets from '../modules/opportunity-datasets'

function mapStateToProps (state, ownProps) {
  const {analysis, project} = state
  const projectName = project.currentProject.name
  const variantId = analysis.activeVariant || 0
  const variantName = project.currentProject.variants[variantId]

  const comparisonProject = select.comparisonProject(state, ownProps)

  let comparisonProjectName = null
  if (comparisonProject) {
    // variant -1 indicates no modifications, just use the raw bundle
    const variantName = analysis.comparisonVariant >= 0
      ? comparisonProject.variants[analysis.comparisonVariant]
      : messages.analysis.baseline
    comparisonProjectName = `${comparisonProject.name}: ${variantName}`
  }

  const activeOpportunityDataset = OpportunityDatasets.select.activeOpportunityDataset(state, ownProps)

  return {
    accessibility: select.accessibility(state, ownProps),
    comparisonAccessibility: select.comparisonAccessibility(state, ownProps),
    comparisonInProgress: select.comparisonInProgress(state, ownProps),
    comparisonPercentileCurves: select.comparisonPercentileCurves(
      state,
      ownProps
    ),
    comparisonProjectName,
    opportunityDatasetName: activeOpportunityDataset && activeOpportunityDataset.name,
    isFetchingIsochrone: analysis.isFetchingIsochrone,
    isochroneCutoff: select.maxTripDurationMinutes(state, ownProps),
    percentileCurves: select.percentileCurves(state, ownProps),
    maxAccessibility: select.maxAccessibility(state, ownProps),
    projectName: `${projectName}: ${variantName}`
  }
}

function matchDispatchToProps (dispatch: Dispatch, ownProps) {
  return {
    setIsochroneCutoff: (cutoff) =>
      dispatch(setProfileRequest({maxTripDurationMinutes: cutoff}))
  }
}

export default connect(mapStateToProps, matchDispatchToProps)(
  StackedPercentileSelector
)
