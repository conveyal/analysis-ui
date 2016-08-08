/** display a scenario */

import lonlng from 'lonlng'
import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {push} from 'react-router-redux'
import Select from 'react-select'
import {createSelector} from 'reselect'

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
  const {project, scenario} = state
  const {params} = props
  const currentBundle = scenario.currentBundle || {}
  const currentProject = project.projectsById[params.projectId] || {}
  const scenarioId = params.scenarioId
  const currentScenario = scenario.scenariosById[scenarioId] || {}
  const defaultFeedId = scenario.feeds.length > 0
    ? scenario.feeds[0].id
    : ''

  return {
    bounds: currentProject.bounds,
    bundleId: currentBundle.id,
    bundleName: currentBundle.name,
    candidateScenarioOptions: candidateScenarioOptionsSelector(state, props),
    defaultFeedId,
    id: params.scenarioId,
    modificationsByType: scenario.modificationsByType,
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
    runSinglePointAnalysis: (opts) => dispatch(runSinglePointAnalysis(opts)),
    setActive: (modification) => dispatch(setActive(modification))
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
    candidateScenarioOptions: PropTypes.array,
    copyFromScenario: PropTypes.func.isRequired,
    createModification: PropTypes.func.isRequired,
    defaultFeedId: PropTypes.string,
    id: PropTypes.string.isRequired,
    modificationsByType: PropTypes.object,
    name: PropTypes.string,
    projectId: PropTypes.string.isRequired,
    replaceModification: PropTypes.func.isRequired,
    runSinglePointAnalysis: PropTypes.func.isRequired,
    setActive: PropTypes.func.isRequired,
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

  _createFns = {}

  createModificationBy (type) {
    if (!this._createFns[type]) {
      this._createFns[type] = () => this.createModification(type)
    }
    return this._createFns[type]
  }

  createModification (type) {
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

  onChangeGeocoder = (feature) => {
    // this.runSinglePointAnalysis(feature)
    this.setState({...this.state, showGeocoder: false})
  }

  closeGeocoder = () => {
    this.setState({...this.state, showGeocoder: false})
  }

  showGeocoder = (e) => {
    e.preventDefault()
    this.setState({...this.state, showGeocoder: true})
  }

  goToEditScenario = () => {
    const {id, projectId, push} = this.props
    push(`/projects/${projectId}/scenarios/${id}/edit`)
  }

  goToImportShapefile = () => {
    const {id, projectId, push} = this.props
    push(`/projects/${projectId}/scenarios/${id}/import-shapefile`)
  }

  render () {
    const {bundleName, candidateScenarioOptions, children, modificationsByType, name} = this.props
    const {showGeocoder} = this.state
    return (
      <div>
        <DockContentTitle>
          <Icon type='code-fork' /> {name}: {bundleName}
          <Button
            className='pull-right'
            onClick={this.goToEditScenario}
            ><Icon type='pencil' />
          </Button>
          <Button
            className='pull-right'
            onClick={this.goToImportShapefile}
            ><Icon type='upload' />
          </Button>
          <Button
            className='pull-right'
            onClick={this.showGeocoder}
            ><Icon type='search' />
          </Button>
        </DockContentTitle>

        {children}

        <VariantEditor />

        {modificationsByType && Object.values(types).map((type) => {
          return <ModificationGroup
            create={this.createModificationBy(type)}
            key={`modification-group-${type}`}
            modifications={modificationsByType[type] || []}
            type={type}
            />
        })}

        {candidateScenarioOptions.length > 0 && this.renderImport({candidateScenarioOptions})}

        {showGeocoder &&
          <Geocoder
            onClose={this.closeGeocoder}
            onChange={this.onChangeGeocoder}
            />
        }
      </div>
    )
  }

  setImportScenarioId = (e) => {
    this.setState({ importScenarioId: e.value })
  }

  renderImport ({
    candidateScenarioOptions
  }) {
    return (
      <div
        className='panel panel-default'
        >
        <div className='panel-body'>
          <div className='form-group'>Import modifications from another scenario</div>
          <div className='form-group'>
            <Select
              onChange={this.setImportScenarioId}
              options={candidateScenarioOptions}
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

export default connect(mapStateToProps, mapDispatchToProps)(Scenario)
