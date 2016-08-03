import lonlng from 'lonlng'
import React, {Component, PropTypes} from 'react'
import Dock from 'react-dock'
import {Map as LeafletMap, TileLayer} from 'react-leaflet'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import {push} from 'react-router-redux'

import {login, logout} from './actions'
import {setCenter as setMapCenter} from './actions/map'
import {loadAll as loadAllProjects} from './actions/project'
import {authIsRequired} from './auth0'
import {Button} from './components/buttons'
import Icon from './components/icon'
import {EDIT_PROJECT_BOUNDS_COMPONENT} from './constants/map'
import EditProjectBounds from './edit-project-bounds'
import GeocoderControl from './geocoder-leaflet-control'
import messages from './messages'
import Modal from './components/modal'
import ScenarioMap from './scenario-map'

import './map.css'

// prefer to use canvas for rendering, improves speed significantly
// http://leafletjs.com/reference.html#global
// with this on we might be able to get rid of the stop layer
window.L_PREFER_CANVAS = true

function mapStateToProps ({
  mapState,
  network,
  project,
  user
}, {
  location,
  params
}) {
  const {error, outstandingRequests} = network
  const hasError = !!error
  return {
    center: mapState.center,
    error: hasError ? error.error : '',
    errorMessage: hasError ? error.detailMessage : '',
    hasError,
    hasScenario: !!params.scenarioId,
    mapComponents: mapState.components || [],
    outstandingRequests,
    project: project.projectsById[params.projectId],
    projects: project.projects,
    projectId: params.projectId,
    userIsLoggedIn: !!(user && user.profile && user.idToken),
    zoom: mapState.zoom
  }
}

const mapDispatchToProps = {
  loadAllProjects,
  login,
  logout,
  push,
  setMapCenter
}

class Application extends Component {
  static defaultProps = {
    variants: ['Default']
  }

  static propTypes = {
    children: PropTypes.any,

    // actions
    loadAllProjects: PropTypes.func.isRequired,
    login: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,

    // state
    center: PropTypes.object,
    error: PropTypes.string,
    errorMessage: PropTypes.string,
    hasError: PropTypes.bool.isRequired,
    hasScenario: PropTypes.bool.isRequired,
    mapComponents: PropTypes.array,
    projectId: PropTypes.string,
    outstandingRequests: PropTypes.number,
    userIsLoggedIn: PropTypes.bool.isRequired,
    zoom: PropTypes.number
  }

  state = {
    center: this.props.center,
    dockWidth: 0.25,
    zoom: this.props.zoom
  }

  componentWillReceiveProps (nextProps) {
    if (!lonlng.isEqual(nextProps.center, this.props.center)) {
      this.setState({
        ...this.state,
        center: nextProps.center
      })
    }
  }

  componentWillMount () {
    const {loadAllProjects} = this.props

    loadAllProjects()
  }

  onDockSizeChange = (dockWidth) => {
    this.setState({dockWidth})
  }

  setMapCenter = (feature) => {
    setMapCenter(feature.geometry.coordinates)
  }

  render () {
    const {children, error, errorMessage, hasError, hasScenario, login, logout, mapComponents, outstandingRequests, projectId, userIsLoggedIn} = this.props
    const {center} = this.state

    return (
      <div>

        {hasError &&
          <UiLock
            error={error}
            errorMessage={errorMessage}
            />
        }

        <Dock
          dimMode='none'
          fluid
          isVisible
          position='left'
          onSizeChange={this.onDockSizeChange}
          size={this.state.dockWidth}
          zIndex={2499}
          >

          <div className='DockContent'>
            <div className='ApplicationTitle'>
              <Link to='/'>Scenario Editor </Link> {outstandingRequests > 0 && <Icon type='spinner' className='fa-spin' />}
              {authIsRequired && <LogInLogOut
                login={login}
                logout={logout}
                userIsLoggedIn={userIsLoggedIn}
                />}
            </div>

            {children}
          </div>
        </Dock>

        <div
          className='Fullscreen'
          style={{
            width: `${(1 - this.state.dockWidth) * 100}%`
          }}
          >
          <LeafletMap
            center={center}
            zoom={12}
            ref={this.mapIsMounted}
            >
            <TileLayer
              url='https://{s}.tiles.mapbox.com/v3/conveyal.hml987j0/{z}/{x}/{y}.png'
              attribution='Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>'
              />

            <GeocoderControl
              apiKey={process.env.MAPZEN_SEARCH_KEY}
              onChange={this.setMapCenter}
              />

            {hasScenario && <ScenarioMap />}

            {mapComponents.map((type, i) => {
              switch (type) {
                case EDIT_PROJECT_BOUNDS_COMPONENT:
                  return <EditProjectBounds
                    key={`map-component-${i}`}
                    projectId={projectId}
                    />
              }
            })}
          </LeafletMap>
        </div>
      </div>
    )
  }
}

function LogInLogOut ({
  login,
  logout,
  userIsLoggedIn
}) {
  if (userIsLoggedIn) {
    return <Button className='pull-right' onClick={logout}>{messages.authentication.logOut}</Button>
  } else {
    return <Button className='pull-right' onClick={login}>{messages.authentication.logIn}</Button>
  }
}

function UiLock ({
  error,
  errorMessage
}) {
  return <Modal>
    <h1>{error}</h1>
    <h3>{errorMessage}</h3>
  </Modal>
}

export default connect(mapStateToProps, mapDispatchToProps)(Application)
