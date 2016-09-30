import {connect} from 'react-redux'

import {fetchIsochrone} from '../actions/analysis'
import {removeComponent} from '../actions/map'
import SinglePointAnalysis from '../components/map/isochrone'
import {ISOCHRONE_COMPONENT} from '../constants/map'

function mapStateToProps (state, props) {
  const {analysis, scenario} = state
  return {
    bundleId: scenario.currentBundle.id,
    isochrone: analysis.isochronesByCutoff ? analysis.isochronesByCutoff[analysis.isochroneCutoff] : null,
    isochroneCutoff: analysis.isochroneCutoff,
    isochroneLatLng: analysis.isochroneLatLng || state.mapState.center,
    modifications: scenario.modifications,
    scenarioId: scenario.currentScenario.id
  }
}

function mapDispatchToProps (dispatch, props) {
  return {
    fetchIsochrone: (opts) => dispatch(fetchIsochrone(opts)),
    remove: () => dispatch(removeComponent(ISOCHRONE_COMPONENT))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SinglePointAnalysis)
