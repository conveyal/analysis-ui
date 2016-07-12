import React, {Component, PropTypes} from 'react'
import Dock from 'react-dock'
import {connect} from 'react-redux'
import {push} from 'react-router-redux'
import Select from 'react-select'

import * as actionCreators from './actions'
import {copyFromScenario, deleteModification, setActive as setActiveModification, setAndRetrieveData as setModificationAndRetrieveData} from './actions/modifications'
import {Button, Group} from './components/buttons'
import messages from './messages'
import Modal from './components/modal'
import Navbar from './navbar'
import Scenario from './scenario'
import ScenarioMap from './map/scenario-map'

import './map.css'

function mapStateToProps (state) {
  const {user} = state
  return {
    currentBundle: state.scenario.currentBundle,
    currentScenario: state.scenario.currentScenario,
    error: state.network.error,
    feeds: state.scenario.feeds,
    feedsById: state.scenario.feedsById,
    mapState: state.mapState,
    modifications: state.scenario.modifications,
    outstandingRequests: state.network.outstandingRequests,
    scenarios: state.scenario.scenarios,
    userIsLoggedIn: !!(user && user.profile && user.idToken),
    variants: state.scenario.variants
  }
}

const mapDispatchToProps = Object.assign({}, actionCreators, {
  copyFromScenario,
  deleteModification,
  push,
  setActiveModification,
  setModificationAndRetrieveData
})

class Application extends Component {
  static defaultProps = {
    variants: ['Default']
  }

  static propTypes = {
    children: PropTypes.any,

    // actions
    copyFromScenario: PropTypes.func.isRequired,
    createVariant: PropTypes.func.isRequired,
    deleteModification: PropTypes.func.isRequired,
    login: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    setActiveModification: PropTypes.func.isRequired,
    setMapState: PropTypes.func.isRequired,
    setModificationAndRetrieveData: PropTypes.func.isRequired,
    setScenario: PropTypes.func.isRequired,
    updateVariant: PropTypes.func.isRequired,

    // state
    currentBundle: PropTypes.object,
    currentScenario: PropTypes.object,
    error: PropTypes.object,
    feeds: PropTypes.array.isRequired,
    feedsById: PropTypes.object.isRequired,
    mapState: PropTypes.object.isRequired,
    modifications: PropTypes.array.isRequired,
    outstandingRequests: PropTypes.number,
    scenarios: PropTypes.array.isRequired,
    userIsLoggedIn: PropTypes.bool.isRequired,
    variants: PropTypes.array.isRequired
  }

  state = {
    dockWidth: 0.25
  }

  getDataAndReplaceModification = (modification) => {
    const {currentBundle} = this.props
    this.props.setModificationAndRetrieveData({
      bundleId: currentBundle.id,
      modification
    })
  }

  copyModificationsFromScenario = () => {
    this.props.copyFromScenario({
      fromScenarioId: this.state.importScenario,
      toScenarioId: this.props.currentScenario.id,
      variants: this.props.variants
    })
  }

  render () {
    const {currentBundle, currentScenario, feeds, login, logout, outstandingRequests, push, userIsLoggedIn} = this.props
    const bundleIsLoaded = !!currentBundle
    const feedsAreLoaded = feeds && feeds.length > 0
    const scenarioIsLoaded = !!currentScenario
    const allLoaded = feedsAreLoaded && scenarioIsLoaded && bundleIsLoaded
    const bundleName = bundleIsLoaded ? currentBundle.name : 'No Bundle'
    const scenarioName = scenarioIsLoaded ? currentScenario.name : 'No Scenario'

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
              scenarioName={scenarioName}
              userIsLoggedIn={userIsLoggedIn}
              />

            <Group justified>
              <Button onClick={() => push('/select-scenario')}>{messages.nav.openScenario}</Button>
              <Button onClick={() => push('/import-shapefile')}>{messages.nav.importShapefile}</Button>
              <Button onClick={() => push('/create-bundle')}>{messages.nav.createBundle}</Button>
              <Button onClick={() => push('/select-bundle')}>{messages.nav.selectBundle}</Button>
            </Group>

            {allLoaded && this.renderScenario()}
            {allLoaded && this.renderImport()}
            {!allLoaded && <div className='alert alert-info'>Select a scenario and a bundle to get started!</div>}

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
    const {createVariant, currentBundle, currentScenario, deleteModification, feeds, feedsById, mapState, modifications, variants, setActiveModification, setActiveTrips, setMapState, updateVariant} = this.props
    return <Scenario
      bundleId={currentBundle.id}
      createVariant={createVariant}
      feeds={feeds}
      feedsById={feedsById}
      scenarioName={currentScenario.name}
      scenarioId={currentScenario.id}
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
        shouldCloseOnOverlayClick
        style={{ overlay: { zIndex: 2500 } }}
        >
        <h1>{error.error}</h1>
        <h3>{error.detailMessage}</h3>
      </Modal>
    }
  }

  renderImport () {
    const {currentBundle, currentScenario, scenarios} = this.props
    const scenarioHasMatchingBundle = (scenario) => scenario.bundleId === currentBundle.id && scenario.id !== currentScenario.id
    const candidateScenarios = scenarios.filter(scenarioHasMatchingBundle)

    if (candidateScenarios.length > 0) {
      return (
        <div
          className='panel panel-default'
          >
          <div className='panel-body'>
            <div className='form-group'>Import modifications from another scenario</div>
            <div className='form-group'>
              <Select
                placeholder='Choose scenario'
                options={candidateScenarios.map((p) => { return { value: p.id, label: p.name } })}
                value={this.state.importScenario}
                onChange={(e) => {
                  this.setState(Object.assign({}, this.state, { importScenario: e.value }))
                }}
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

export default connect(mapStateToProps, mapDispatchToProps)(Application)
