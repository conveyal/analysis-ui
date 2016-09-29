import {connect} from 'react-redux'

import {fetchIsochrone} from '../actions/analysis'
import {removeComponent} from '../actions/map'
import SinglePointAnalysis from '../components/map/single-point-analysis'
import {SINGLE_POINT_ANALYSIS_COMPONENT} from '../constants/map'

function mapStateToProps (state, props) {
  return {
    bundleId: state.scenario.currentBundle.id,
    initialLatLng: state.mapState.center,
    isochrone: state.analysis.avgCase ? state.analysis.avgCase.isochrones[11].geometry : null,
    modifications: state.scenario.modifications,
    scenarioId: state.scenario.currentScenario.id
  }
}

function mapDispatchToProps (dispatch, props) {
  return {
    fetchIsochrone: (opts) => dispatch(fetchIsochrone(opts)),
    remove: () => dispatch(removeComponent(SINGLE_POINT_ANALYSIS_COMPONENT))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SinglePointAnalysis)
