/** display a scenario */

import lonlng from 'lonlng'
import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {push} from 'react-router-redux'
import Select from 'react-select'

import {runSinglePoint as runSinglePointAnalysis} from './actions/analysis'
import {create as createModification, copyFromScenario, setAndRetrieveData as replaceModification} from './actions/modifications'
import {load} from './actions/scenario'
import {Button} from './components/buttons'
import DockContentTitle from './components/dock-content-title'
import Icon from './components/icon'
import * as types from './utils/modification-types'
import Geocoder from './geocoder'
import ModificationGroup from './modification-group'
import VariantEditor from './variant-editor'

const scenarioHasMatchingBundle = ({bundleId, scenarioId}) =>
  (scenario) =>
    scenario.bundleId === bundleId && scenario.id !== scenarioId

function mapStateToProps ({
  project,
  scenario
}, {
  params
}) {
  const currentBundle = scenario.currentBundle || {}
  const currentProject = project.projectsById[params.projectId] || {}
  const bundleId = currentBundle.id
  const scenarioId = params.scenarioId // TODO get from react router params
  const currentScenario = scenario.scenariosById[scenarioId] || {}
  const candidateScenarios = bundleId
    ? scenario.scenarios.filter(scenarioHasMatchingBundle({bundleId, scenarioId}))
    : []
  const defaultFeedId = scenario.feeds.length > 0
    ? scenario.feeds[0].id
    : ''
  const modificationIdsByType = scenario.modifications.reduce((modifications, modification) => {
    const {type} = modification
    if (!modifications[type]) modifications[type] = []
    modifications[type].push(modification.id)
    return modifications
  }, {})

  return {
    bounds: currentProject.bounds,
    bundleId: currentBundle.id,
    bundleName: currentBundle.name,
    candidateScenarios,
    defaultFeedId,
    id: params.scenarioId,
    modificationIdsByType,
    name: currentScenario.name,
    projectId: params.projectId,
    variants: scenario.variants
  }
}

function mapDispatchToProps (dispatch) {
  return {
    copyFromScenario: (opts) => dispatch(copyFromScenario(opts)),
    createModification: (opts) => dispatch(createModification(opts)),
    load: (id) => dispatch(load(id)),
    push: (opts) => dispatch(push(opts)),
    replaceModification: (opts) => dispatch(replaceModification(opts)),
    runSinglePointAnalysis: (opts) => dispatch(runSinglePointAnalysis(opts))
  }
}

class Scenario extends Component {
  static propTypes = {
    bounds: PropTypes.shape({
      north: PropTypes.number,
      east: PropTypes.number,
      south: PropTypes.number,
      west: PropTypes.number
    }),
    bundleId: PropTypes.string,
    bundleName: PropTypes.string,
    copyFromScenario: PropTypes.func.isRequired,
    createModification: PropTypes.func.isRequired,
    defaultFeedId: PropTypes.string,
    id: PropTypes.string.isRequired,
    modificationIdsByType: PropTypes.object.isRequired,
    name: PropTypes.string,
    projectId: PropTypes.string.isRequired,
    replaceModification: PropTypes.func.isRequired,
    runSinglePointAnalysis: PropTypes.func.isRequired,
    variants: PropTypes.array.isRequired
  }

  state = {
    importScenarioId: null,
    showGeocoder: false
  }

  componentDidMount () {
    const {load, id} = this.props
    load(id)
  }

  componentWillMount () {
    // TODO: Add scenario map component
  }

  componentWillUnmount () {
    // TODO: Remove scenario map component
  }

  componentWillReceiveProps (newProps) {
    const {load, id} = this.props
    const isNewScenarioId = id !== newProps.id
    if (isNewScenarioId) load(newProps.id)
  }

  copyModificationsFromScenario = () => {
    const {copyFromScenario, id, variants} = this.props
    copyFromScenario({
      fromScenarioId: this.state.importScenarioId,
      toScenarioId: id,
      variants
    })
  }

  createModification = (type) => {
    const {createModification, defaultFeedId, id, variants} = this.props
    createModification({
      feedId: defaultFeedId,
      scenarioId: id,
      type,
      variants: variants.map((v) => true)
    })
  }

  runSinglePointAnalysis (feature) {
    const {bundleId, id, runSinglePointAnalysis} = this.props
    runSinglePointAnalysis({
      bundleId,
      latlng: lonlng.fromGeoJSON(feature.geometry.coordinates),
      scenarioId: id
    })
  }

  render () {
    const {bounds, bundleName, candidateScenarios, children, id, modificationIdsByType, name, projectId, push} = this.props
    const {showGeocoder} = this.state
    return (
      <div>
        <DockContentTitle>
          <Icon type='code-fork' /> {name}: {bundleName}
          <Button
            className='pull-right'
            onClick={() => push(`/projects/${projectId}/scenarios/${id}/edit`)}
            ><Icon type='pencil' />
          </Button>
          <Button
            className='pull-right'
            onClick={(e) => {
              e.preventDefault()
              this.setState({...this.state, showGeocoder: true})
            }}
            ><Icon type='search' />
          </Button>
        </DockContentTitle>

        {children}

        <VariantEditor />

        {Object.values(types).map((type) => {
          return <ModificationGroup
            create={this.createModification}
            key={`modification-group-${type}`}
            modificationIds={modificationIdsByType[type]}
            type={type}
            />
        })}

        {candidateScenarios.length > 0 && this.renderImport({candidateScenarios})}
        {showGeocoder &&
          <Geocoder
            maxLatlng={maxLatlng(bounds)}
            minLatlng={minLatlng(bounds)}
            onClose={() => this.setState({...this.state, showGeocoder: false})}
            onChange={(feature) => {
              this.runSinglePointAnalysis(feature)
              this.setState({...this.state, showGeocoder: false})
            }}
            />
        }
      </div>
    )
  }

  renderImport ({
    candidateScenarios
  }) {
    return (
      <div
        className='panel panel-default'
        >
        <div className='panel-body'>
          <div className='form-group'>Import modifications from another scenario</div>
          <div className='form-group'>
            <Select
              onChange={(e) => { this.setState({ importScenarioId: e.value }) }}
              options={candidateScenarios.map((p) => { return { value: p.id, label: p.name } })}
              placeholder='Select a scenario...'
              value={this.state.importScenarioId}
              />
          </div>
          <div className='form-group'>
            <Button
              block
              onClick={this.copyModificationsFromScenario}
              style='success'
              >Import modifications
            </Button>
          </div>
        </div>
      </div>
      )
  }
}

function maxLatlng (bounds) {
  return {
    lat: Math.max(bounds.north, bounds.south),
    lng: Math.max(bounds.east, bounds.west)
  }
}

function minLatlng (bounds) {
  return {
    lat: Math.min(bounds.north, bounds.south),
    lng: Math.min(bounds.east, bounds.west)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Scenario)
