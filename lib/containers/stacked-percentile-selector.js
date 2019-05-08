import {connect} from 'react-redux'

import {setProfileRequest} from 'lib/actions/analysis/profile-request'
import StackedPercentileSelector from 'lib/components/analysis/stacked-percentile-selector'
import {activeOpportunityDataset} from 'lib/modules/opportunity-datasets/selectors'
import * as select from 'lib/selectors'

function mapStateToProps(state, ownProps) {
  const projectName = select.displayedScenarioName(state)
  const comparisonProjectName = select.displayedComparisonScenarioName(state)

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

function matchDispatchToProps(dispatch) {
  return {
    setIsochroneCutoff: cutoff =>
      dispatch(setProfileRequest({maxTripDurationMinutes: cutoff}))
  }
}

export default connect(
  mapStateToProps,
  matchDispatchToProps
)(StackedPercentileSelector)
