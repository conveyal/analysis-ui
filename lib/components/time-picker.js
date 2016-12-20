/** Choose hours of day, using seconds since midnight */

import React, {Component, PropTypes} from 'react'

import {Text} from './input'
import {secondsToHhMmString} from '../utils/time'

export default class TimePicker extends Component {
  static propTypes = {
    value: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired
  }

  _setTime = (e) => {
    const timeSplit = e.target.value.split(':')
    const time = Number(timeSplit[0]) * 3600 + Number(timeSplit[1]) * 60
    this.props.onChange(time)
  }

  render () {
    const {value, ...rest} = this.props
    return <Text
      type='time'
      value={secondsToHhMmString(value)}
      {...rest}
      onChange={this._setTime}
      />
  }
}
