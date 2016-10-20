import {connect} from 'react-redux'

import {fetchIsochrone} from '../actions/analysis'
import {removeComponent} from '../actions/map'
import SinglePointAnalysis from '../components/map/isochrone'
import {ISOCHRONE_COMPONENT} from '../constants/map'

function mapStateToProps (state, props) {
  const {analysis, scenario, project} = state
  return {
    bundleId: scenario.currentBundle.id,
    isFetchingIsochrone: analysis.isFetchingIsochrone,
    isochrone: analysis.isochrone,
    isochroneCutoff: analysis.isochroneCutoff,
    isochroneLatLng: analysis.isochroneLatLng || state.mapState.center,
    modifications: scenario.modifications.filter(m => m.variants[analysis.activeVariant]),
    workerVersion: project.currentProject.r5Version,
    scenarioId: scenario.currentScenario.id,
    accessibility: analysis.accessibility,
    currentIndicator: analysis.currentIndicator
  }
}

function mapDispatchToProps (dispatch, props) {
  return {
    fetchIsochrone: (opts) => dispatch(fetchIsochrone(opts)),
    remove: () => dispatch(removeComponent(ISOCHRONE_COMPONENT))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SinglePointAnalysis)
