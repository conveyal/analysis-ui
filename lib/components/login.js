import {Component} from 'react'

import {lock} from '../utils/auth0'

export default class Login extends Component {
  componentDidMount () {
    lock.show()
  }

  render () {
    return null
  }
}
