// @flow
import get from 'lodash/get'
import {connect} from 'react-redux'

import {setRegionalAnalysisOrigin} from '../actions/analysis/regional'
import RegionalAnalysisSamplingDistribution
  from '../components/map/regional-analysis-sampling-distribution'

function mapStateToProps (state, params) {
  return {
    origin: get(state, 'analysis.regional.origin'),
    samplingDistribution: get(state, 'analysis.regional.samplingDistribution'),
    comparisonSamplingDistribution: get(state, 'analysis.regional.comparisonSamplingDistribution'),
    _id: get(state, 'analysis.regional._id')
  }
}

export default connect(mapStateToProps, {setRegionalAnalysisOrigin})(
  RegionalAnalysisSamplingDistribution
)
