/** display a scenario */

import {connect} from 'react-redux'

import {addComponent} from '../actions/map'
import {load} from '../actions/scenario'
import {SINGLE_POINT_ANALYSIS_COMPONENT} from '../constants/map'
import Scenario from '../components/scenario'

function mapStateToProps (state, props) {
  const {scenario} = state
  const {params} = props
  const currentBundle = scenario.currentBundle
  const scenarioId = params.scenarioId
  const currentScenario = scenario.scenariosById[scenarioId]

  return {
    id: params.scenarioId,
    isLoaded: !!currentScenario && !!currentBundle && !!scenario.modifications,
    name: currentScenario ? currentScenario.name : '',
    projectId: params.projectId
  }
}

function mapDispatchToProps (dispatch) {
  return {
    addComponentToMap: () => dispatch(addComponent(SINGLE_POINT_ANALYSIS_COMPONENT)),
    load: (id) => dispatch(load(id))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Scenario)
