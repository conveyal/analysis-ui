// @flow
import message from '@conveyal/woonerf/message'
import {connect} from 'react-redux'
import get from 'lodash/get'

import {setProfileRequest} from '../actions/analysis'
import StackedPercentileSelector
  from '../components/analysis/stacked-percentile-selector'
import * as select from '../selectors'
import cleanProjectScenarioName from '../utils/clean-project-scenario-name'
import {activeOpportunityDataset} from '../modules/opportunity-datasets/selectors'

function mapStateToProps (state, ownProps) {
  const currentProject = select.currentProject(state, ownProps)
  const projectName = cleanProjectScenarioName(currentProject,
    state.analysis.variantIndex)
  const comparisonProject = select.comparisonProject(state, ownProps)
  // variant -1 indicates no modifications, just use the raw bundle
  const comparisonProjectName =cleanProjectScenarioName(comparisonProject,
    state.analysis.comparisonVariant)

  const opportunityDataset = activeOpportunityDataset(state, ownProps)

  return {
    accessibility: select.accessibility(state, ownProps),
    comparisonAccessibility: select.comparisonAccessibility(state, ownProps),
    comparisonInProgress: select.comparisonInProgress(state, ownProps),
    comparisonPercentileCurves: select.comparisonPercentileCurves(
      state,
      ownProps
    ),
    comparisonProjectName,
    opportunityDatasetName: opportunityDataset && opportunityDataset.name,
    isochroneCutoff: select.maxTripDurationMinutes(state, ownProps),
    percentileCurves: select.percentileCurves(state, ownProps),
    maxAccessibility: select.maxAccessibility(state, ownProps),
    nearestPercentile: select.nearestPercentile(state, ownProps),
    projectName
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
