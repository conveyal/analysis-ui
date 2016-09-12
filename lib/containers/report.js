/** Container for a report on a scenario */

import {connect} from 'react-redux'
import Report from '../report/index'
import {load as loadScenario} from '../actions/scenario'
import {load as loadProject} from '../actions/project'

function mapStateToProps (state, props) {
  let { scenario } = state
  let { scenarioId, projectId } = props.params
  return {
    modifications: scenario.modifications,
    scenarioId,
    projectId,
    scenario: scenario.currentScenario,
    bundle: scenario.currentBundle,
    feedsById: scenario.feedsById
  }
}

function mapDispatchToProps (dispatch) {
  return {
    loadScenario: (id) => dispatch(loadScenario(id)),
    loadProject: (id) => dispatch(loadProject(id))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Report)
