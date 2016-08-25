import {connect} from 'react-redux'

import {createVariant, expandVariant, saveToServer, showVariant, updateVariant} from '../actions/scenario'
import VariantEditor from '../components/variant-editor'

function mapStateToProps (state) {
  return {
    currentScenario: state.scenario.currentScenario,
    feeds: state.scenario.feeds,
    modifications: state.scenario.modifications,
    // TODO what is currentScenario for?
    scenarioName: state.scenario.currentScenario.name,
    variants: state.scenario.variants
  }
}

function mapDispatchToProps (dispatch) {
  return {
    createVariant: (name) => dispatch(createVariant(name)),
    expandVariant: (index) => dispatch(expandVariant(index)),
    saveScenario: (scenario) => dispatch(saveToServer(scenario)),
    showVariant: (index) => dispatch(showVariant(index)),
    updateVariant: (opts) => dispatch(updateVariant(opts))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(VariantEditor)
