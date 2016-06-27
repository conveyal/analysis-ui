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
    user: PropTypes.object
  }

  render () {
    const {bundleName, projectName} = this.props
    const project = projectName || 'No Project'
    const bundle = bundleName || 'No Bundle'
    return (
      <DockContentTitle>
        <strong>{project}</strong>: {bundle}
        {this.renderLogInLogOut()}
      </DockContentTitle>
    )
  }

  renderLogInLogOut () {
    const {authIsRequired, login, logout, messages, user} = this.props
    if (authIsRequired) {
      if (user && user.profile && user.idToken) {
        return <Button className='pull-right' onClick={logout}>{messages.authentication.logOut}</Button>
      } else {
        return <Button className='pull-right' onClick={login}>{messages.authentication.logIn}</Button>
      }
    }
    return <span></span>
  }
}
