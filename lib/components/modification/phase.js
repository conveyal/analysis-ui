import React, {Component} from 'react'
import Select from 'react-select'

import {Number as InputNumber} from '../input'

export default class Phase extends Component {
  render () {
    const {phaseFromStop, phaseAtStop, phaseSeconds} = this.props
    return <div>
      <Select
        value={phaseFromStop}
        /> // from stop
      <Select
        value={phaseAtStop}
        /> // at stop
      <InputNumber
        name='Phase Seconds'
        onChange={this._setPhaseSeconds}
        value={phaseSeconds}
        />
    </div>
  }
}
