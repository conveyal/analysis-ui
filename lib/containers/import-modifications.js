import {connect} from 'react-redux'

import {copyFromScenario} from '../actions/modifications'
import ImportModifications from '../components/import-modifications'
import candidateScenarioOptionsSelector from '../selectors/candidate-scenario-options'

function mapStateToProps (state, props) {
  return {
    candidateScenarioOptions: candidateScenarioOptionsSelector(state, props),
    toScenarioId: props.params.scenarioId,
    variants: state.scenario.variants
  }
}

function mapDispatchToProps (dispatch) {
  return {
    copyFromScenario: opts => dispatch(copyFromScenario(opts))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ImportModifications)
