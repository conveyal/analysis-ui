import {latLngBounds, Browser} from 'leaflet'
import lonlng from 'lonlng'
import React, {Component, PropTypes} from 'react'
import {Map as LeafletMap, TileLayer} from 'react-leaflet'
import {Link} from 'react-router'
import {sprintf} from 'sprintf-js'

import {authIsRequired} from '../utils/auth0'
import {Button} from './buttons'
import Icon from './icon'
import {EDIT_PROJECT_BOUNDS_COMPONENT, SINGLE_POINT_ANALYSIS_COMPONENT} from '../constants/map'
import EditProjectBounds from '../containers/edit-project-bounds'
import GeocoderControl from './map/geocoder-leaflet-control'
import messages from '../utils/messages'
import Modal from './modal'
import ModificationEditor from '../containers/modification-editor'
import ScenarioMap from '../scenario-map'
import SinglePointAnalysis from '../containers/single-point-analysis'

// prefer to use canvas for rendering, improves speed significantly
// http://leafletjs.com/reference.html#global
// with this on we might be able to get rid of the stop layer
window.L_PREFER_CANVAS = true

export default class Application extends Component {
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
    username: PropTypes.string,
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
    document.body.classList.add('Editor')

    loadAllProjects()
  }

  componentWillUnmount () {
    document.body.classList.remove('Editor')
  }

  _setMapCenter = (feature) => {
    this.props.setMapCenter(feature.geometry.coordinates)
  }

  render () {
    const {activeModification, children, error, errorMessage, hasError, hasScenario, login, logout, mapComponents, outstandingRequests, projectId, userIsLoggedIn, username} = this.props
    const {bounds, center} = this.state

    return (
      <div id='editor'>
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

            <div className='LoggedInAs'>
              {sprintf(messages.authentication.username, username)}
            </div>
          </div>

          <div className='InnerDock'>
            {children}
          </div>
        </div>

        {activeModification && <ModificationEditor modification={activeModification} />}

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
              url={Browser.retina ? process.env.LEAFLET_RETINA_URL : process.env.LEAFLET_TILE_URL}
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
                case SINGLE_POINT_ANALYSIS_COMPONENT:
                  return <SinglePointAnalysis
                    key={`map-component-${i}`}
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
    return <Button className='btn-xs pull-right' onClick={logout}>{messages.authentication.logOut}</Button>
  } else {
    return <Button className='btn-xs pull-right' onClick={login}>{messages.authentication.logIn}</Button>
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
