import React, {Component, PropTypes} from 'react'

import {authIsRequired} from './auth0'
import {Button} from './components/buttons'
import DockContentTitle from './components/dock-content-title'

export default class Navbar extends Component {
  static propTypes = {
    bundleName: PropTypes.string.isRequired,
    login: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
    messages: PropTypes.object.isRequired,
    scenarioName: PropTypes.string.isRequired,
    userIsLoggedIn: PropTypes.bool.isRequired
  }

  render () {
    const {bundleName, scenarioName} = this.props
    return (
      <DockContentTitle>
        <strong>{scenarioName}</strong>: {bundleName}
        {this.renderLogInLogOut()}
      </DockContentTitle>
    )
  }

  renderLogInLogOut () {
    const {login, logout, messages, userIsLoggedIn} = this.props
    if (authIsRequired) {
      if (userIsLoggedIn) {
        return <Button className='pull-right' onClick={logout}>{messages.authentication.logOut}</Button>
      } else {
        return <Button className='pull-right' onClick={login}>{messages.authentication.logIn}</Button>
      }
    }
    return <span></span>
  }
}
