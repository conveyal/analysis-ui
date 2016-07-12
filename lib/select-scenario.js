import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {push} from 'react-router-redux'
import uuid from 'uuid'

import {loadScenario, setScenario} from './actions'
import {Button} from './components/buttons'
import {Text} from './components/input'
import Modal from './components/modal'

function mapStateToProps (state) {
  return {
    scenarios: state.scenario.scenarios
  }
}

function mapDispatchToProps (dispatch) {
  return {
    close: () => dispatch(push('/')),
    loadScenario: (id) => dispatch(loadScenario(id)),
    setScenario: (scenario) => dispatch(setScenario(scenario))
  }
}

class SelectScenario extends Component {
  static propTypes = {
    close: PropTypes.func.isRequired,
    scenarios: PropTypes.array.isRequired,
    setScenario: PropTypes.func.isRequired
  }

  state = {
    newScenarioName: ''
  }

  createNewScenario = () => {
    this.props.setScenario({
      id: uuid.v4(),
      name: this.state.newScenarioName,
      modifications: [],
      variants: ['Default']
    })
    this.props.close()
  }

  selectScenario = (scenario) => {
    this.props.loadScenario(scenario.id)
    this.props.close()
  }

  updateNewScenarioName = (e) => {
    this.setState({ newScenarioName: e.target.value })
  }

  render () {
    const {newScenarioName} = this.state

    return (
      <Modal
        onClose={this.props.close}
        >
        <legend>Open Scenario</legend>
        <ul>{this.renderScenarios()}</ul>

        <form>
          <legend>Create Scenario</legend>
          <Text
            name='Scenario Name'
            onChange={this.updateNewScenarioName}
            value={newScenarioName} />
          <Button
            onClick={this.createNewScenario}
            style='success'
            >Create
          </Button>
          <Button
            onClick={this.props.close}
            style='danger'
            >Cancel
          </Button>
        </form>
      </Modal>
    )
  }

  renderScenarios () {
    return this.props.scenarios.map((scenario) => {
      const name = scenario.name && scenario.name.length > 0 ? scenario.name : <i>(no name)</i>
      return (
        <li key={scenario.id}>
          <a
            href='#'
            onClick={() => this.selectScenario(scenario)}
            >{name}</a>
        </li>
      )
    })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectScenario)
