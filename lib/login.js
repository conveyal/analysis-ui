import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {push} from 'react-router-redux'

import {setUser} from './actions'
import {lock} from './auth0'

class Login extends Component {
  static propTypes = {
    push: PropTypes.func.isRequired,
    setUser: PropTypes.func.isRequired
  }

  componentDidMount () {
    lock.show({
      authParams: {
        scope: 'openid analyst offline_access'
      }
    },
    (err, profile, idToken, accessToken, state, refreshToken) => {
      if (err) {
        window.alert(err)
        console.error(err)
      } else {
        this.props.setUser({accessToken, idToken, profile, refreshToken})
        this.props.push('/')
      }
    })
  }

  render () {
    return <div className='alert alert-danger'> You must be logged in to use the scenario editor.</div>
  }
}

function mapDispatchToProps (dispatch) {
  return {
    push: (path) => dispatch(push(path)),
    setUser: (user) => dispatch(setUser(user))
  }
}

export default connect((state) => state, mapDispatchToProps)(Login)
