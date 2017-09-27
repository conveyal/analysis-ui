import {connect} from 'react-redux'
import {push} from 'react-router-redux'

import {clearError} from '../actions'
import {load as loadProject} from '../actions/project'
import {setCenter as setMapCenter} from '../actions/map'
import Application from '../components/application'
import selectActiveModification from '../selectors/active-modification'
import selectBundleId from '../selectors/bundle-id'
import selectProjectId from '../selectors/current-project-id'
import selectScenarioId from '../selectors/current-scenario-id'
import selectScenarioIsLoaded from '../selectors/scenario-is-loaded'
import selectModificationBounds from '../selectors/modification-bounds'

function mapStateToProps (state, props) {
  const {mapState, network, user, analysis} = state
  const {error, outstandingRequests} = network
  const hasError = !!error

  const scenarioId = selectScenarioId(state, props)
  return {
    activeModification: selectActiveModification(state, props),
    bundleId: selectBundleId(state, props),
    center: mapState.center,
    error: hasError ? error.error : '',
    errorMessage: hasError ? error.detailMessage : '',
    hasError,
    hasScenario: !!scenarioId,
    mapComponents: mapState.components || [],
    modificationBounds: selectModificationBounds(state, props),
    outstandingRequests,
    projectId: selectProjectId(state, props),
    scenarioId,
    scenarioIsLoaded: selectScenarioIsLoaded(state, props),
    username: user.profile && user.profile.name,
    zoom: mapState.zoom,
    analysisMode: analysis.active
  }
}

const mapDispatchToProps = {
  clearError,
  loadProject,
  push,
  setMapCenter
}

export default connect(mapStateToProps, mapDispatchToProps)(Application)
