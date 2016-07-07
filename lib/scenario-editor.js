import React, {Component, PropTypes} from 'react'
import Dock from 'react-dock'
import Modal from 'react-modal'
import {connect} from 'react-redux'
import {push} from 'react-router-redux'
import Select from 'react-select'
import uuid from 'uuid'

import * as actionCreators from './actions'
import getDataForModifications from './actions/get-data-for-modifications'
import authenticatedFetch, {parseJSON} from './utils/authenticated-fetch'
import {Button, Group} from './components/buttons'
import messages from './messages'
import Navbar from './navbar'
import Scenario from './scenario'
import ScenarioMap from './map/scenario-map'

import './map.css'

function mapStateToProps (state) {
  const {user} = state
  return {
    currentBundle: state.scenario.currentBundle,
    currentProject: state.scenario.currentProject,
    error: state.network.error,
    feeds: state.scenario.feeds,
    feedsById: state.scenario.feedsById,
    mapState: state.mapState,
    modifications: state.scenario.modifications,
    outstandingRequests: state.network.outstandingRequests,
    projects: state.scenario.projects,
    userIsLoggedIn: !!(user && user.profile && user.idToken),
    variants: state.scenario.variants
  }
}

const mapDispatchToProps = Object.assign({}, actionCreators, {getDataForModifications, push})

class ScenarioEditor extends Component {
  static defaultProps = {
    variants: ['Default']
  }

  static propTypes = {
    children: PropTypes.any,

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
    currentBundle: PropTypes.object,
    currentProject: PropTypes.object,
    error: PropTypes.object,
    feeds: PropTypes.array.isRequired,
    feedsById: PropTypes.object.isRequired,
    mapState: PropTypes.object.isRequired,
    modifications: PropTypes.array.isRequired,
    outstandingRequests: PropTypes.number,
    projects: PropTypes.array.isRequired,
    userIsLoggedIn: PropTypes.bool.isRequired,
    variants: PropTypes.array.isRequired
  }

  state = {
    dockWidth: 0.25
  }

  getDataAndReplaceModification = (modification) => {
    const {currentBundle, modifications} = this.props
    this.props.getDataForModifications({modifications: [...modifications, modification], bundleId: currentBundle.id})
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
    const {currentBundle, currentProject, login, logout, outstandingRequests, push, userIsLoggedIn} = this.props
    const projectIsLoaded = !!currentProject
    const bundleIsLoaded = !!currentBundle
    const allLoaded = projectIsLoaded && bundleIsLoaded
    const bundleName = bundleIsLoaded ? currentBundle.name : 'No Bundle'
    const projectName = projectIsLoaded ? currentProject.name : 'No Project'

    return (
      <div>

        {this.renderUiLock()}

        <Dock
          dimMode='none'
          fluid
          isVisible
          position='left'
          onSizeChange={(dockWidth) => {
            this.setState({dockWidth})
          }}
          size={this.state.dockWidth}
          zIndex={2499}
          >

          <div className='DockContent'>
            <div className='ApplicationTitle'>Scenario Editor</div>
            <Navbar
              bundleName={bundleName}
              login={login}
              logout={logout}
              messages={messages}
              projectName={projectName}
              userIsLoggedIn={userIsLoggedIn}
              />

            <Group justified>
              <Button onClick={() => push('/select-project')}>{messages.nav.openProject}</Button>
              <Button onClick={() => push('/import-shapefile')}>{messages.nav.importShapefile}</Button>
              <Button onClick={() => push('/create-bundle')}>{messages.nav.createBundle}</Button>
              <Button onClick={() => push('/select-bundle')}>{messages.nav.selectBundle}</Button>
            </Group>

            {allLoaded && this.renderScenario()}
            {allLoaded && this.renderImport()}
            {!allLoaded && <div className='alert alert-info'>Select a project and a bundle to get started!</div>}

            {outstandingRequests > 0 &&
              <OutstandingRequests
                requests={outstandingRequests}
                />
            }

            {this.props.children}
          </div>
        </Dock>

        <div
          className='Fullscreen'
          style={{
            width: `${(1 - this.state.dockWidth) * 100}%`
          }}
          >
          <ScenarioMap
            replaceModification={this.getDataAndReplaceModification}
            />
        </div>
      </div>
    )
  }

  renderScenario () {
    const {createVariant, currentBundle, currentProject, deleteModification, feeds, feedsById, mapState, modifications, variants, setActiveModification, setActiveTrips, setMapState, updateVariant} = this.props
    return <Scenario
      bundleId={currentBundle.id}
      createVariant={createVariant}
      feeds={feeds}
      feedsById={feedsById}
      projectName={currentProject.name}
      scenarioId={currentProject.id}
      deleteModification={deleteModification}
      mapState={mapState}
      modifications={modifications}
      replaceModification={this.getDataAndReplaceModification}
      setActiveModification={setActiveModification}
      setActiveTrips={setActiveTrips}
      setMapState={setMapState}
      updateVariant={updateVariant}
      variants={variants}
      />
  }

  /** if there has been a network error, lock the UI */
  renderUiLock () {
    const {error} = this.props

    if (error) {
      // can't use CommonModal because we don't want it to be closeable
      return <Modal
        isOpen
        shouldCloseOnOverlayClick={false}
        style={{ overlay: { zIndex: 2500 } }}
        >
        <h1>{error.error}</h1>
        <h3>{error.detailMessage}</h3>
      </Modal>
    }
  }

  renderImport () {
    const {currentBundle, currentProject, projects} = this.props
    const projectHasMatchingBundle = (project) => project.bundleId === currentBundle.id && project.id !== currentProject.id
    const candidateProjects = projects.filter(projectHasMatchingBundle)

    if (candidateProjects.length > 0) {
      return (
        <div
          className='panel panel-default'
          >
          <div className='panel-body'>
            <div className='form-group'>Import modifications from another scenario</div>
            <div className='form-group'>
              <Select
                placeholder='Choose scenario'
                options={candidateProjects.map((p) => { return { value: p.id, label: p.name } })}
                value={this.state.importScenario}
                onChange={(e) => {
                  this.setState(Object.assign({}, this.state, { importScenario: e.value }))
                }}
                />
            </div>
            <div className='form-group'><Button block style='success' onClick={this.copyModificationsFromScenario}>Import modifications</Button></div>
          </div>
        </div>
        )
    }
  }
}

// TODO: use a class and styles
const OutstandingRequests = ({requests}) => {
  return <div
    style={{
      position: 'fixed',
      right: '0px',
      bottom: '0px',
      padding: '3px',
      backgroundColor: '#aaa'
    }}
    title={`${requests} requests outstanding`}
    >
    {messages.network.saving}
  </div>
}

export default connect(mapStateToProps, mapDispatchToProps)(ScenarioEditor)
