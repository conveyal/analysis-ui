import React, { Component, PropTypes } from 'react'
import Dock from 'react-dock'
import {connect} from 'react-redux'
import {push} from 'react-router-redux'
import Modal from 'react-modal'
import Select from 'react-select'
import uuid from 'uuid'

import * as actionCreators from './actions'
import {authIsRequired} from './auth0'
import {Button, Group} from './components/buttons'
import messages from './messages'
import Navbar from './navbar'
import Scenario from './scenario'
import {getDataForModifications} from './transit-data-source'
import ScenarioMap from './map/scenario-map'
import './map.css'
import authenticatedFetch, {parseJSON} from './utils/authenticated-fetch'

function mapStateToProps (state) {
  return {
    bundleId: state.scenario.bundleId,
    data: state.scenario.data,
    id: state.scenario.id,
    mapState: state.mapState,
    modifications: state.scenario.modifications,
    name: state.scenario.name,
    projects: state.scenario.projects,
    user: state.user,
    variants: state.scenario.variants,
    outstandingRequests: state.network.outstandingRequests,
    error: state.network.error
  }
}

const mapDispatchToProps = Object.assign({}, actionCreators, {getDataForModifications, push})

class ScenarioEditor extends Component {
  static defaultProps = {
    variants: ['Default']
  }

  static propTypes = {
    children: PropTypes.any,
    user: PropTypes.object,

    // actions
    createVariant: PropTypes.func.isRequired,
    deleteModification: PropTypes.func.isRequired,
    getDataForModifications: PropTypes.func.isRequired,
    login: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    replaceModification: PropTypes.func.isRequired,
    setProject: PropTypes.func.isRequired,
    setMapState: PropTypes.func.isRequired,
    updateVariant: PropTypes.func.isRequired,

    // state
    data: PropTypes.object.isRequired,
    mapState: PropTypes.object.isRequired,
    projects: PropTypes.array.isRequired,
    variants: PropTypes.array.isRequired,
    outstandingRequests: PropTypes.number,

    bundleId: PropTypes.string,
    id: PropTypes.string,
    modifications: PropTypes.object,
    name: PropTypes.string
  }

  state = {
    dockWidth: 0.3
  }

  getDataAndReplaceModification = (modification) => {
    const {bundleId, modifications} = this.props
    this.props.getDataForModifications({modifications: [...modifications.values(), modification], bundleId})
    this.props.replaceModification(modification)
  }

  copyModificationsFromScenario = () => {
    authenticatedFetch(`/api/scenario/${this.state.importScenario}/modifications`)
      .then(parseJSON)
      .then((res) => {
        res
          // safe to not assign to fresh object because these modifications just came from JSON
          .map((mod) => {
            let variants = []

            for (let i = 0; i < this.props.variants.length; i++) {
              if (i < mod.variants.length) variants.push(mod.variants[i])
              else variants.push(false)
            }

            return Object.assign(mod, { id: uuid.v4(), scenario: this.props.id, variants })
          })
          .forEach((mod) => this.props.replaceModification(mod))
      })
  }

  render () {
    const {bundleId, createVariant, data, login, logout, mapState, modifications, name, push, setMapState, updateVariant, user} = this.props
    const bundle = data.bundles.find((b) => b.id === bundleId)
    const bundleName = bundle && bundle.name
    return (
      <div>

        {this.renderUiLock()}

        <div
          className='Fullscreen'
          style={{
            width: `${(1 - this.state.dockWidth) * 100}%`
          }}
          >
          <ScenarioMap
            bundle={bundle}
            createVariant={createVariant}
            data={data}
            mapState={mapState}
            modifications={modifications}
            replaceModification={this.getDataAndReplaceModification}
            setMapState={setMapState}
            updateVariant={updateVariant}
            />
        </div>

        <Dock
          dimMode='none'
          fluid
          isVisible
          position='right'
          onSizeChange={(dockWidth) => {
            this.setState({dockWidth})
          }}
          size={this.state.dockWidth}
          zIndex={2499}
          >

          <div className='DockContent'>
            <Navbar
              authIsRequired={authIsRequired}
              bundleName={bundleName}
              login={login}
              logout={logout}
              messages={messages}
              projectName={name}
              user={user}
              />

            <Group justified>
              <Button onClick={() => push('/select-project')}>{messages.nav.openProject}</Button>
              <Button onClick={() => push('/import-shapefile')}>{messages.nav.importShapefile}</Button>
              <Button onClick={() => push('/create-bundle')}>{messages.nav.createBundle}</Button>
              <Button onClick={() => push('/select-bundle')}>{messages.nav.selectBundle}</Button>
            </Group>

            {this.renderScenario()}

            {this.renderOutstandingRequests()}

            {this.renderImport()}

            {this.props.children}
          </div>
        </Dock>
      </div>
    )
  }

  renderScenario () {
    const {bundleId, createVariant, data, deleteModification, id, mapState, modifications, variants, name, setMapState, updateVariant} = this.props
    if (id && bundleId) {
      return <Scenario
        projectName={name}
        bundleId={bundleId}
        createVariant={createVariant}
        data={data}
        scenarioId={id}
        deleteModification={deleteModification}
        mapState={mapState}
        modifications={modifications}
        replaceModification={this.getDataAndReplaceModification}
        setMapState={setMapState}
        updateVariant={updateVariant}
        variants={variants}
        />
    } else {
      return <div className='alert alert-info'>Select or create a project and bundle!</div>
    }
  }

  renderOutstandingRequests () {
    let { outstandingRequests } = this.props

    if (outstandingRequests) {
      return <div
        style={{
          position: 'fixed',
          right: '0px',
          bottom: '0px',
          padding: '3px',
          backgroundColor: '#aaa'
        }}
        title={outstandingRequests + ' requests outstanding'}
        >
        {messages.network.saving}
      </div>
    }
  }

  /** if there has been a network error, lock the UI */
  renderUiLock () {
    let { error } = this.props

    if (error != null) {
      // can't use CommonModal because we don't want it to be closeable
      return <Modal
        isOpen
        shouldCloseOnOverlayClick={false}
        style={{ overlay: { zIndex: 2500 } }}
        >
        <h1>{error.message}</h1>
        <h3>{error.detailMessage}</h3>
      </Modal>
    }
  }

  renderImport () {
    const { id, bundleId, projects } = this.props

    let candidateProjects = projects.filter(p => p.bundleId === bundleId && p.id !== id)

    if (candidateProjects.length > 0) {
      return (
        <div>
          <h3>Import modifications from another scenario</h3>
          <Select
            placeholder='Choose scenario'
            options={candidateProjects.map(p => { return { value: p.id, label: p.name } })}
            value={this.state.importScenario}
            onChange={(e) => {
              this.setState(Object.assign({}, this.state, { importScenario: e.value }))
            }}
            />
          <Button onClick={this.copyModificationsFromScenario}>Import modifications</Button>
        </div>
        )
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ScenarioEditor)
