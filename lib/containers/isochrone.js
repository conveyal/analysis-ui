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
    isochroneLonLat: analysis.isochroneLonLat || state.mapState.center,
    modifications: scenario.modifications.filter(m => m.variants[analysis.activeVariant]),
    workerVersion: project.currentProject.r5Version,
    scenarioId: scenario.currentScenario.id,
    variantIndex: analysis.activeVariant,
    accessibility: analysis.accessibility,
    currentIndicator: analysis.currentIndicator,
    comparisonScenarioId: analysis.comparisonScenarioId,
    comparisonVariant: analysis.comparisonVariant,
    comparisonBundleId: analysis.comparisonBundleId,
    comparisonModifications: analysis.comparisonModifications,
    comparisonIsochrone: analysis.comparisonIsochrone,
    comparisonInProgress: analysis.comparisonInProgress,
    profileRequest: analysis.profileRequest
  }
}

function mapDispatchToProps (dispatch, props) {
  return {
    fetchIsochrone: (opts) => dispatch(fetchIsochrone({ ...opts, dispatch })),
    remove: () => dispatch(removeComponent(ISOCHRONE_COMPONENT))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SinglePointAnalysis)
