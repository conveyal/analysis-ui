import {latLngBounds} from 'leaflet'
import lonlng from 'lonlng'
import React, {Component, PropTypes} from 'react'
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
import activeModificationSelector from './selectors/active-modification'
import EditProjectBounds from './edit-project-bounds'
import GeocoderControl from './geocoder-leaflet-control'
import messages from './messages'
import Modal from './components/modal'
import ModificationDock from './modification-dock'
import ScenarioMap from './scenario-map'

import './map.css'

// prefer to use canvas for rendering, improves speed significantly
// http://leafletjs.com/reference.html#global
// with this on we might be able to get rid of the stop layer
window.L_PREFER_CANVAS = true

function mapStateToProps (state, props) {
  const {mapState, network, project, user} = state
  const {params} = props
  const {error, outstandingRequests} = network
  const hasError = !!error
  return {
    activeModification: activeModificationSelector(state, props),
    center: mapState.center,
    error: hasError ? error.error : '',
    errorMessage: hasError ? error.detailMessage : '',
    feedsById: state.scenario.feedsById,
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
    feedsById: PropTypes.object.isRequired,
    hasError: PropTypes.bool.isRequired,
    hasScenario: PropTypes.bool.isRequired,
    mapComponents: PropTypes.array,
    projectId: PropTypes.string,
    outstandingRequests: PropTypes.number,
    userIsLoggedIn: PropTypes.bool.isRequired,
    zoom: PropTypes.number
  }

  state = {
    bounds: getModificationBounds({feedsById: this.props.feedsById, modification: this.props.activeModification}),
    center: this.props.center,
    zoom: this.props.zoom
  }

  componentWillReceiveProps (nextProps) {
    if (!lonlng.isEqual(nextProps.center, this.props.center)) {
      this.setState({
        ...this.state,
        center: nextProps.center
      })
    }

    const newBounds = getModificationBounds({feedsById: nextProps.feedsById, modification: nextProps.activeModification})

    if (newBounds) {
      this.setState({
        ...this.state,
        bounds: newBounds
      })
    }
  }

  componentWillMount () {
    const {loadAllProjects} = this.props

    loadAllProjects()
  }

  _setMapCenter = (feature) => {
    this.props.setMapCenter(feature.geometry.coordinates)
  }

  render () {
    const {activeModification, children, error, errorMessage, hasError, hasScenario, login, logout, mapComponents, outstandingRequests, projectId, userIsLoggedIn} = this.props
    const {bounds, center} = this.state

    return (
      <div>

        {hasError &&
          <UiLock
            error={error}
            errorMessage={errorMessage}
            />
        }

        <div className='ApplicationDock'>
          <div className='ApplicationTitle'>
            <Link to='/'>Scenario Editor </Link> {outstandingRequests > 0 && <Icon type='spinner' className='fa-spin' />}
            {authIsRequired && <LogInLogOut
              login={login}
              logout={logout}
              userIsLoggedIn={userIsLoggedIn}
              />}
          </div>

          <div className='InnerDock'>
            {children}
          </div>
        </div>

        {activeModification && <ModificationDock modification={activeModification} />}

        <div
          className={`Fullscreen ${activeModification ? 'hasActiveModification' : ''}`}
          >
          <LeafletMap
            bounds={bounds}
            center={center}
            zoom={12}
            ref={this.mapIsMounted}
            >
            <TileLayer
              url={process.env.LEAFLET_TILE_URL}
              attribution={process.env.LEAFLET_ATTRIBUTION}
              />

            <GeocoderControl
              onChange={this._setMapCenter}
              />

            {hasScenario && <ScenarioMap activeModification={activeModification} />}

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

function getModificationBounds ({feedsById, modification}) {
  if (modification) {
    const {routes} = modification
    if (feedsById && feedsById[modification.feed] && routes && routes.length === 1) {
      const route = feedsById[modification.feed].routesById[routes[0]]
      if (route && route.patterns) {
        return getRouteBounds(route)
      }
    }
  }
}

function getRouteBounds (route) {
  const geometries = route.patterns.map((pattern) => pattern.geometry)
  const coordinates = geometries.reduce((coordinates, geometry) => coordinates.concat(geometry.coordinates), [])
  if (coordinates.length > 0) {
    const bounds = latLngBounds(lonlng(coordinates[0]))
    coordinates.forEach((coordinate) => bounds.extend(lonlng(coordinate)))
    bounds.pad(1.25)
    return bounds
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Application)
