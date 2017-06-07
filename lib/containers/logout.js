// @flow
import {Component} from 'react'
import {connect} from 'react-redux'

import {logout} from '../actions'

class Logout extends Component {
  componentWillMount () {
    this.props.logout()
  }

  render () {
    return null
  }
}

export default connect(null, {logout})(Logout)
