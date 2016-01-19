/**
 * The main component that controls the scenario editor.
 */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {SET_LOCATION} from './action-types'

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
  constructor (props) {
    super(props)
    // http://www.newmediacampaigns.com/blog/refactoring-react-components-to-es6-classes
    this.setWorld = this.setWorld.bind(this)
    this.setDc = this.setDc.bind(this)
  }

  render () {
    return <div>
      Hello {this.props.what}<br/>
      <a href="#" onClick={this.setWorld}>World</a> | <a href="#" onClick={this.setDc}>DC</a>
    </div>
  }

  /** update the app's state */
  setWorld () {
    this.props.setWhat('world')
    return false
  }

  setDc () {
    this.props.setWhat('DC')
    return false
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ScenarioEditor)
