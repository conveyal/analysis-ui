import {connect} from 'react-redux'

import {saveToServer, showVariant, updateVariant} from '../actions/scenario'
import VariantEditor from '../components/variant-editor'
import selectProjectId from '../selectors/current-project-id'

function mapStateToProps (state, ownProps) {
  return {
    currentScenario: state.scenario.currentScenario,
    feeds: state.scenario.feeds,
    modifications: state.scenario.modifications,
    // TODO what is currentScenario for?
    scenarioName: state.scenario.currentScenario.name,
    scenarioId: state.scenario.currentScenario.id,
    projectId: selectProjectId(state, ownProps),
    variants: state.scenario.variants
  }
}

function mapDispatchToProps (dispatch) {
  return {
    saveScenario: (scenario) => dispatch(saveToServer(scenario)),
    showVariant: (index) => dispatch(showVariant(index)),
    updateVariant: (opts) => dispatch(updateVariant(opts))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(VariantEditor)
