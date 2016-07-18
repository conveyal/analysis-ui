import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {goBack} from 'react-router-redux'
import Select from 'react-select'

import {create, saveToServer} from './actions/scenario'
import getFeedsRoutesAndStops from './actions/get-feeds-routes-and-stops'
import {Button} from './components/buttons'
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

function mapDispatchToProps (dispatch) {
  return {
    close: () => dispatch(goBack()),
    create: (opts) => dispatch(create(opts)),
    save: (opts) => dispatch(saveToServer(opts)),
    reloadBundles: () => dispatch(getFeedsRoutesAndStops({forceCompleteUpdate: true}))
  }
}

class EditScenario extends Component {
  static propTypes = {
    bundleId: PropTypes.string,
    bundleName: PropTypes.string,
    bundles: PropTypes.array.isRequired,
    close: PropTypes.func.isRequired,
    create: PropTypes.func.isRequired,
    id: PropTypes.string,
    isEditing: PropTypes.bool.isRequired,
    name: PropTypes.string,
    projectId: PropTypes.string.isRequired,
    reloadBundles: PropTypes.func.isRequired,
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

  render () {
    const {bundleName, bundles, isEditing, projectId, reloadBundles} = this.props
    const {bundleId, name} = this.state
    const readyToCreate = name && name.length > 0 && bundleId && bundleId.length > 0
    return (
      <Panel>
        <Heading>{isEditing ? messages.scenario.editTitle : messages.scenario.createAction}</Heading>
        <Body>
          <Text
            name='Scenario name'
            onChange={(e) => this.setState({ ...this.state, name: e.target.value })}
            value={name} />
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
              reload={(bundleId) => {
                reloadBundles()
                this.setState({
                  ...this.state,
                  bundleId,
                  showCreateBundle: false
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
        </Body>
      </Panel>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditScenario)
