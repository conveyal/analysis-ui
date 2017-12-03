/** Show a regional analysis on the map */

import {connect} from 'react-redux'
import {removeComponent} from '../actions/map'
import {setRegionalAnalysisOrigin} from '../actions/analysis/regional'
import RegionalLayer from '../components/map/regional'
import {
  REGIONAL_ANALYSIS_SAMPLING_DISTRIBUTION_COMPONENT
} from '../constants/map'

function mapStateToProps ({analysis, region, mapState}) {
  return {
    // TODO hack
    baseGrid: analysis.regional.grid || {
      data: [],
      width: 0,
      height: 0,
      north: 0,
      west: 0,
      zoom: 9
    },
    differenceGrid: analysis.regional.differenceGrid || {
      data: [],
      width: 0,
      height: 0,
      north: 0,
      west: 0,
      zoom: 9
    },
    probabilityGrid: analysis.regional.probabilityGrid || {
      data: [],
      width: 0,
      height: 0,
      north: 0,
      west: 0,
      zoom: 9
    },
    minimumImprovementProbability: analysis.regional
      .minimumImprovementProbability,
    breaks: analysis.regional.breaks,
    comparisonId: analysis.regional.comparisonId,
    _id: analysis.regional._id,
    isRegionalAnalysisSamplingDistributionComponentOnMap: mapState.components.indexOf(
      REGIONAL_ANALYSIS_SAMPLING_DISTRIBUTION_COMPONENT
    ) > -1
  }
}

const mapDispatchToProps = function (dispatch) {
  return {
    removeRegionalAnalysisSamplingDistributionComponentFromMap: () =>
      dispatch(
        removeComponent(REGIONAL_ANALYSIS_SAMPLING_DISTRIBUTION_COMPONENT)
      ),
    setRegionalAnalysisOrigin: origin =>
      dispatch(setRegionalAnalysisOrigin(origin))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RegionalLayer)
