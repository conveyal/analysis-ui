import React, {PropTypes} from 'react'
import {connect} from 'react-redux'
import Select from 'react-select'
import {createSelector} from 'reselect'

import {copyFromScenario} from './actions/modifications'
import {Button} from './components/buttons'
import DeepEqualComponent from './components/deep-equal'
import Panel, {Body, Heading} from './components/panel'

const scenarioHasMatchingBundle = ({bundleId, scenarioId, scenarios}) =>
  (scenario) =>
    scenario.bundleId === bundleId && scenario.id !== scenarioId

const candidateScenarioOptionsSelector = createSelector(
  (state) => state.scenario.scenarios,
  (state, props) => props.params.scenarioId,
  (state) => state.scenario.currentBundle,
  (scenarios, scenarioId, bundle) => {
    if (bundle) {
      return scenarios
        .filter(scenarioHasMatchingBundle({bundleId: bundle.id, scenarioId}))
        .map((scenario) => { return {value: scenario.id, label: scenario.name} })
    } else {
      return []
    }
  }
)

function mapStateToProps (state, props) {
  return {
    candidateScenarioOptions: candidateScenarioOptionsSelector(state, props),
    toScenarioId: props.params.scenarioId,
    variants: state.scenario.variants
  }
}

function mapDispatchToProps (dispatch) {
  return {
    copyFromScenario: (opts) => dispatch(copyFromScenario(opts))
  }
}

class ImportModifications extends DeepEqualComponent {
  static propTypes = {
    copyFromScenario: PropTypes.func.isRequired,
    toScenarioId: PropTypes.string.isRequired,
    variants: PropTypes.array.isRequired
  }

  state = {}

  _copyModificationsFromScenario = () => {
    const {copyFromScenario, toScenarioId, variants} = this.props
    copyFromScenario({
      fromScenarioId: this.state.importScenarioId,
      toScenarioId,
      variants
    })
  }

  _setImportScenarioId = (e) => {
    this.setState({importScenarioId: e.value})
  }

  render () {
    const {candidateScenarioOptions} = this.props
    const {importScenarioId} = this.state
    return (
      <Panel>
        <Heading>Import modifications from another scenario</Heading>
        <Body>
          <div className='form-group'>
            <Select
              onChange={this._setImportScenarioId}
              options={candidateScenarioOptions}
              placeholder='Select a scenario...'
              value={importScenarioId}
              />
          </div>
          <div className='form-group'>
            <Button
              block
              onClick={this._copyModificationsFromScenario}
              style='success'
              >Import modifications
            </Button>
          </div>
        </Body>
      </Panel>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ImportModifications)
