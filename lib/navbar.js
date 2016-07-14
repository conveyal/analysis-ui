import React from 'react'

import {authIsRequired} from './auth0'
import {Button} from './components/buttons'
import DockContentTitle from './components/dock-content-title'
import messages from './messages'

export default function Navbar ({
  bundleName,
  login,
  logout,
  projectName,
  scenarioName,
  userIsLoggedIn
}) {
  return (
    <div>
      <div className='ApplicationTitle'>
        Scenario Editor
        <LogInLogOut
          login={login}
          logout={logout}
          userIsLoggedIn={userIsLoggedIn}
          />
      </div>
      <DockContentTitle>
        <strong>{projectName}</strong><br />
        <strong>{scenarioName}</strong>: {bundleName}
      </DockContentTitle>
    </div>
  )
}

function LogInLogOut ({
  login,
  logout,
  userIsLoggedIn
}) {
  if (authIsRequired) {
    if (userIsLoggedIn) {
      return <Button className='pull-right' onClick={logout}>{messages.authentication.logOut}</Button>
    } else {
      return <Button className='pull-right' onClick={login}>{messages.authentication.logIn}</Button>
    }
  }
  return <span></span>
}
