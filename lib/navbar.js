import React, {Component, PropTypes} from 'react'

import {Button} from './components/buttons'
import DockContentTitle from './components/dock-content-title'

export default class Navbar extends Component {
  static propTypes = {
    authIsRequired: PropTypes.bool.isRequired,
    bundleName: PropTypes.string,
    login: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
    messages: PropTypes.object.isRequired,
    projectName: PropTypes.string,
    user: PropTypes.object.isRequired
  }

  render () {
    const {authIsRequired, bundleName, login, logout, messages, projectName, user} = this.props
    const logInLogOut = authIsRequired
      ? user && user.profile && user.id_token
        ? <Button className='pull-right' onClick={logout}>{messages.authentication.logOut}</Button>
        : <Button className='pull-right' onClick={login}>{messages.authentication.logIn}</Button>
      : <span></span>
    return (
        <DockContentTitle>
          <strong>{projectName || <em>No project</em>}</strong>: {bundleName || <em>No bundle</em>}
          {logInLogOut}
        </DockContentTitle>
    )
  }
}
