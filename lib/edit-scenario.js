import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {goBack} from 'react-router-redux'
import Select from 'react-select'

import {create, deleteScenario, saveToServer} from './actions/scenario'
import {addBundle} from './actions'
import {Button} from './components/buttons'
import Icon from './components/icon'
import {Group as FormGroup, Text} from './components/input'
import Panel, {Body, Heading} from './components/panel'
import CreateBundle from './create-bundle'
import messages from './messages'

function mapStateToProps ({
  scenario
}, {
  params
}) {
  const currentScenario = scenario.scenariosById[params.scenarioId] || {}
  const currentBundle = scenario.bundlesById[currentScenario.bundleId] || {}
  return {
    bundles: scenario.bundles,
    bundleId: currentBundle.id,
    bundleName: currentBundle.name,
    id: params.scenarioId,
    isEditing: !!params.scenarioId,
    name: currentScenario.name,
    projectId: params.projectId
  }
}

function mapDispatchToProps (dispatch, props) {
  return {
    close: () => dispatch(goBack()),
    create: (opts) => dispatch(create(opts)),
    deleteScenario: () => dispatch(deleteScenario(props.params)),
    save: (opts) => dispatch(saveToServer(opts)),
    addBundle: (bundle) => dispatch(addBundle(bundle))
  }
}

class EditScenario extends Component {
  static propTypes = {
    bundleId: PropTypes.string,
    bundleName: PropTypes.string,
    bundles: PropTypes.array.isRequired,
    close: PropTypes.func.isRequired,
    create: PropTypes.func.isRequired,
    deleteScenario: PropTypes.func.isRequired,
    id: PropTypes.string,
    isEditing: PropTypes.bool.isRequired,
    name: PropTypes.string,
    projectId: PropTypes.string.isRequired,
    addBundle: PropTypes.func.isRequired,
    save: PropTypes.func.isRequired
  }

  state = {
    bundleId: this.props.bundleId,
    name: this.props.name
  }

  componentWillReceiveProps (newProps) {
    this.setState({bundleId: newProps.bundleId, name: newProps.name})
  }

  createOrSave = () => {
    const {close, create, id, isEditing, projectId, save} = this.props
    const {bundleId, name} = this.state
    if (isEditing) {
      save({bundleId, id, name, projectId})
      close()
    } else {
      create({
        bundleId,
        name,
        projectId
      })
    }
  }

  _deleteScenario = () => {
    if (window.confirm(messages.scenario.deleteConfirmation)) {
      this.props.deleteScenario()
    }
  }

  render () {
    const {bundleName, bundles, isEditing, projectId, addBundle} = this.props
    const {bundleId, name} = this.state
    const readyToCreate = name && name.length > 0 && bundleId && bundleId.length > 0
    return (
      <Panel>
        <Heading>{isEditing ? messages.scenario.editTitle : messages.scenario.createAction}</Heading>
        <Body>
          <Text
            name='Scenario name'
            onChange={(e) => this.setState({ ...this.state, name: e.target.value })}
            value={name}
            />
          {isEditing &&
            <FormGroup><strong>Bundle:</strong> {bundleName} <br /><small>Bundle cannot be changed once a scenario is created</small></FormGroup>
          }
          {!isEditing &&
            <FormGroup>
              <Select
                clearable={false}
                options={bundles.map((bundle) => { return { value: bundle.id, label: bundle.name } })}
                onChange={(option) => this.setState({...this.state, bundleId: option.value})}
                placeholder='Select a bundle...'
                value={bundleId}
                />
            </FormGroup>
          }
          {!isEditing &&
            <CreateBundle
              projectId={projectId}
              onBundleCreate={(bundle) => {
                addBundle(bundle)
                this.setState({
                  ...this.state,
                  bundleId: bundle.id
                })
              }}
              />
          }
          <Button
            block
            disabled={!readyToCreate}
            onClick={this.createOrSave}
            style='success'
            >{isEditing ? messages.scenario.editAction : messages.scenario.createAction}
          </Button>
          {isEditing &&
            <Button
              block
              onClick={this._deleteScenario}
              style='danger'
              ><Icon type='trash' /> {messages.scenario.delete}
            </Button>
          }
        </Body>
      </Panel>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditScenario)
