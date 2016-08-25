import {connect} from 'react-redux'
import {push} from 'react-router-redux'

import {login, logout} from '../actions'
import {setCenter as setMapCenter} from '../actions/map'
import {loadAll as loadAllProjects} from '../actions/project'
import Application from '../components/application'
import activeModificationSelector from '../selectors/active-modification'

function mapStateToProps (state, props) {
  const {mapState, network, project, user} = state
  const {params} = props
  const {error, outstandingRequests} = network
  const hasError = !!error
  return {
    activeModification: activeModificationSelector(state, props),
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
    userIsLoggedIn: !!(user && user.profile && user.idToken),
    username: user.profile.name,
    zoom: mapState.zoom
  }
}

const mapDispatchToProps = {
  loadAllProjects,
  login,
  logout,
  push,
  setMapCenter
}

export default connect(mapStateToProps, mapDispatchToProps)(Application)
