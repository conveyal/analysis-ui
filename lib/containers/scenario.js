// @flow
import {connect} from 'react-redux'

import {loadBundle} from '../actions'
import {addComponent} from '../actions/map'
import {load} from '../actions/scenario'
import {SINGLE_POINT_ANALYSIS_COMPONENT} from '../constants/map'
import Scenario from '../components/scenario'

import selectBundle from '../selectors/current-bundle'
import selectProjectId from '../selectors/current-project-id'
import selectScenario from '../selectors/current-scenario'
import selectScenarioId from '../selectors/current-scenario-id'

function mapStateToProps (state, props) {
  const currentBundle = selectBundle(state, props)
  const scenario = selectScenario(state, props)

  return {
    id: selectScenarioId(state, props),
    bundleIsLoaded: !!currentBundle,
    isLoaded: !!scenario,
    projectId: selectProjectId(state, props),
    scenario
  }
}

function mapDispatchToProps (dispatch: Dispatch) {
  return {
    addComponentToMap: () => dispatch(addComponent(SINGLE_POINT_ANALYSIS_COMPONENT)),
    load: (id) => dispatch(load(id)),
    loadBundle: (id) => dispatch(loadBundle(id))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Scenario)
