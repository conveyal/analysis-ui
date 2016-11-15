import {Component} from 'react'

import {lock} from '../utils/auth0'

export default class Login extends Component {
  componentDidMount () {
    // when testing, auth0 credentials are not currently entered, so `lock` will be null
    if (lock) {
      lock.show()
    }
  }

  render () {
    return null
  }
}
