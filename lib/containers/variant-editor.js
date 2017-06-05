import {connect} from 'react-redux'
import {push} from 'react-router-redux'

import {saveToServer, showVariant, updateVariant} from '../actions/scenario'
import VariantEditor from '../components/variant-editor'
import r5VersionUnsupported from '../selectors/r5-version-unsupported'

function mapStateToProps (state) {
  return {
    currentScenario: state.scenario.currentScenario,
    feeds: state.scenario.feeds,
    modifications: state.scenario.modifications,
    // TODO what is currentScenario for?
    scenarioName: state.scenario.currentScenario.name,
    scenarioId: state.scenario.currentScenario.id,
    projectId: state.project.currentProject.id,
    r5VersionUnsupported: r5VersionUnsupported(state),
    variants: state.scenario.variants
  }
}

function mapDispatchToProps (dispatch) {
  return {
    saveScenario: (scenario) => dispatch(saveToServer(scenario)),
    showVariant: (index) => dispatch(showVariant(index)),
    updateVariant: (opts) => dispatch(updateVariant(opts)),
    // I should be able to access projectId and scenarioId some other way one would think
    analyzeVariant: ({ projectId, scenarioId, index }) => dispatch(push(`/projects/${projectId}/scenarios/${scenarioId}/analysis/${index}`))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(VariantEditor)
