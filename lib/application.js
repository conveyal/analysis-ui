import React, {Component, PropTypes} from 'react'
import Dock from 'react-dock'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import {push} from 'react-router-redux'

import {login, logout} from './actions'
import {loadAll as loadAllProjects} from './actions/project'
import {authIsRequired} from './auth0'
import {Button} from './components/buttons'
import messages from './messages'
import Modal from './components/modal'
import ScenarioMap from './map/scenario-map'

import './map.css'

function mapStateToProps ({
  network,
  project,
  user
}) {
  const {error} = network
  const hasError = !!error

  return {
    error: hasError ? error.error : '',
    errorMessage: hasError ? error.detailMessage : '',
    hasError,
    outstandingRequests: network.outstandingRequests,
    projects: project.projects,
    userIsLoggedIn: !!(user && user.profile && user.idToken)
  }
}

const mapDispatchToProps = {
  loadAllProjects,
  login,
  logout,
  push
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
    error: PropTypes.string,
    errorMessage: PropTypes.string,
    hasError: PropTypes.bool.isRequired,
    outstandingRequests: PropTypes.number,
    userIsLoggedIn: PropTypes.bool.isRequired
  }

  state = {
    dockWidth: 0.25
  }

  componentWillMount () {
    const {loadAllProjects} = this.props

    loadAllProjects()
  }

  render () {
    const {children, error, errorMessage, hasError, login, logout, outstandingRequests, userIsLoggedIn} = this.props

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
          onSizeChange={(dockWidth) => { this.setState({dockWidth}) }}
          size={this.state.dockWidth}
          zIndex={2499}
          >

          <div className='DockContent'>
            <div className='ApplicationTitle'>
              <Link to='/'>Scenario Editor</Link>
              {authIsRequired && <LogInLogOut
                login={login}
                logout={logout}
                userIsLoggedIn={userIsLoggedIn}
                />}
            </div>

            {children}

            {outstandingRequests > 0 && // TODO: Move this next to the title via a spinner
              <OutstandingRequests
                requests={outstandingRequests}
                />
            }
          </div>
        </Dock>

        <div
          className='Fullscreen'
          style={{
            width: `${(1 - this.state.dockWidth) * 100}%`
          }}
          >
          <ScenarioMap />
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
  return <Modal
    isOpen
    shouldCloseOnOverlayClick
    style={{ overlay: { zIndex: 2500 } }}
    >
    <h1>{error}</h1>
    <h3>{errorMessage}</h3>
  </Modal>
}

// TODO: use a class and styles
function OutstandingRequests ({requests}) {
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
