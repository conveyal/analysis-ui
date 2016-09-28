import {connect} from 'react-redux'

import {createVariant, saveToServer, showVariant, updateVariant} from '../actions/scenario'
import VariantEditor from '../components/variant-editor'

function mapStateToProps (state) {
  return {
    currentScenario: state.scenario.currentScenario,
    feeds: state.scenario.feeds,
    modifications: state.scenario.modifications,
    // TODO what is currentScenario for?
    scenarioName: state.scenario.currentScenario.name,
    scenarioId: state.scenario.currentScenario.id,
    projectId: state.project.currentProject.id,
    variants: state.scenario.variants
  }
}

function mapDispatchToProps (dispatch) {
  return {
    createVariant: (name) => dispatch(createVariant(name)),
    saveScenario: (scenario) => dispatch(saveToServer(scenario)),
    showVariant: (index) => dispatch(showVariant(index)),
    updateVariant: (opts) => dispatch(updateVariant(opts))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(VariantEditor)
