/**
 * The main component that controls the scenario editor, and handles the map.
 */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {SET_LOCATION} from './action-types'
import map from './map'

function mapStateToProps (state) {
  return state
}

/** Create functions that are passed to the component in props, which update the state */
function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    setWhat: function (what) {
      return {
        type: SET_LOCATION,
        what
      }
    }
  }, dispatch)
}

class ScenarioEditor extends Component {
  render () {
    return map
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ScenarioEditor)
