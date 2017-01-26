/** Container for a report on a scenario */

import {connect} from 'react-redux'
import Report from '../components/report'
import {load as loadScenario} from '../actions/scenario'
import {load as loadProject} from '../actions/project'

function mapStateToProps (state, props) {
  let { scenario } = state
  let { scenarioId, projectId, variantId } = props.params
  variantId = parseInt(variantId)
  return {
    modifications: scenario.modifications.filter(m => m.variants[variantId]),
    scenarioId,
    projectId,
    scenario: scenario.currentScenario,
    variant: scenario.variants[variantId],
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
