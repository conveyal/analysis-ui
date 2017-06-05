import {connect} from 'react-redux'
import {push} from 'react-router-redux'

import {login, logout, loadR5Versions} from '../actions'
import {setCenter as setMapCenter} from '../actions/map'
import {loadAll as loadAllProjects} from '../actions/project'
import Application from '../components/application'
import activeModificationSelector from '../selectors/active-modification'

function mapStateToProps (state, props) {
  const {mapState, network, project, scenario, user, analysis} = state
  const {params} = props
  const {error, outstandingRequests} = network
  const hasError = !!error
  return {
    activeModification: activeModificationSelector(state, props),
    bundleId: scenario.currentScenario && scenario.currentScenario.bundleId,
    center: mapState.center,
    error: hasError ? error.error : '',
    errorMessage: hasError ? error.detailMessage : '',
    feedsById: state.scenario.feedsById,
    hasError,
    hasScenario: !!params.scenarioId,
    mapComponents: mapState.components || [],
    outstandingRequests,
    project: project.projectsById[params.projectId],
    projects: project.projects,
    projectId: params.projectId,
    scenarioIsLoaded: !!params.scenarioId && !!scenario.modifications,
    userIsLoggedIn: !!(user && user.profile && user.idToken),
    username: user.profile && user.profile.name,
    zoom: mapState.zoom,
    analysisMode: analysis.active
  }
}

const mapDispatchToProps = {
  loadAllProjects,
  loadR5Versions,
  login,
  logout,
  push,
  setMapCenter
}

export default connect(mapStateToProps, mapDispatchToProps)(Application)
