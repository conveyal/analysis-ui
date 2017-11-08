/** Displays the bootstrapped sampling distribution of accessibility in a map popup */

import {connect} from 'react-redux'
import {setRegionalAnalysisOrigin} from '../actions/analysis/regional'
import {removeComponent} from '../actions/map'
import RegionalAnalysisSamplingDistribution
  from '../components/map/regional-analysis-sampling-distribution'
import {
  REGIONAL_ANALYSIS_SAMPLING_DISTRIBUTION_COMPONENT
} from '../constants/map'

function mapStateToProps (state, params) {
  return {
    origin: state.analysis.regional.origin,
    samplingDistribution: state.analysis.regional.samplingDistribution,
    comparisonSamplingDistribution: state.analysis.regional
      .comparisonSamplingDistribution,
    _id: state.analysis.regional._id
  }
}

function mapDispatchToProps (dispatch) {
  return {
    remove: () =>
      dispatch(
        removeComponent(REGIONAL_ANALYSIS_SAMPLING_DISTRIBUTION_COMPONENT)
      ),
    setRegionalAnalysisOrigin: opts => dispatch(setRegionalAnalysisOrigin(opts))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  RegionalAnalysisSamplingDistribution
)
