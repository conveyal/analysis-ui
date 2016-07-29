import isEqual from 'lodash.isequal'
import {Component} from 'react'

export default class DeepEqual extends Component {
  shouldComponentUpdate (newProps, newState) {
    return !isEqual(newProps, this.props) || !isEqual(newState, this.state)
  }
}
