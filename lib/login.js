import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {push} from 'react-router-redux'

import {loadAllScenarios, setUser} from './actions'
import {lock} from './auth0'

class Login extends Component {
  static propTypes = {
    loadAllScenarios: PropTypes.func.isRequired,
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
        this.props.loadAllScenarios()
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
    loadAllScenarios: () => dispatch(loadAllScenarios()),
    push: (path) => dispatch(push(path)),
    setUser: (user) => dispatch(setUser(user))
  }
}

export default connect((state) => state, mapDispatchToProps)(Login)
