import React, {Component} from 'react'

import {lock} from './auth0'

export default class Login extends Component {
  componentDidMount () {
    lock.show()
  }

  render () {
    return <div className='alert alert-danger'> You must be logged in to use the scenario editor.</div>
  }
}
