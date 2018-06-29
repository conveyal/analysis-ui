// @flow
import {connect} from 'react-redux'
import {setRegionalAnalysisOrigin} from '../actions/analysis/regional'
import RegionalLayer from '../components/map/regional'

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
    _id: analysis.regional._id
  }
}

const mapDispatchToProps = function (dispatch) {
  return {
    setRegionalAnalysisOrigin: origin =>
      dispatch(setRegionalAnalysisOrigin(origin))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RegionalLayer)
