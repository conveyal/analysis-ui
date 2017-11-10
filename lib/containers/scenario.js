// @flow
import {connect} from 'react-redux'
import {push} from 'react-router-redux'

import {addComponent} from '../actions/map'
import {getForScenario as loadModifications} from '../actions/modifications'
import {
  deleteScenario,
  downloadVariant,
  load,
  set
} from '../actions/scenario'
import {SINGLE_POINT_ANALYSIS_COMPONENT} from '../constants/map'
import Scenario from '../components/scenario'

import selectBundle from '../selectors/current-bundle'
import selectScenario from '../selectors/current-scenario'
import selectScenarioId from '../selectors/current-scenario-id'
import selectModifications from '../selectors/modifications'

function mapStateToProps (state, props) {
  const scenario = selectScenario(state, props)
  return {
    _id: selectScenarioId(state, props),
    bundle: selectBundle(state, props),
    modifications: selectModifications(state, props),
    scenario
  }
}

function mapDispatchToProps (dispatch: Dispatch, ownProps) {
  return {
    addComponentToMap: () =>
      dispatch(addComponent(SINGLE_POINT_ANALYSIS_COMPONENT)),
    deleteScenario: () =>
      dispatch([deleteScenario(ownProps.params.scenarioId), push('/')]),
    setCurrentScenario: scenario => dispatch(set(scenario)),
    downloadVariant: index => dispatch(downloadVariant(index)),
    load: id => dispatch(load(id)),
    loadModifications: opts => dispatch(loadModifications(opts))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Scenario)
