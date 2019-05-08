import React, {PureComponent} from 'react'

import {secondsToMmSsString, mmSsStringToSeconds} from '../utils/time'

import {Text} from './input'

function stringToSeconds(str) {
  if (str.length === 0) {
    return 0
  } else if (String(parseFloat(str)) === str) {
    return parseFloat(str) * 60
  } else {
    try {
      const seconds = mmSsStringToSeconds(str)
      if (Number.isInteger(seconds)) return seconds
    } catch (error) {
      // Invalid number, return 0
    }
    return 0
  }
}

export default class MinutesSeconds extends PureComponent {
  _updateIfChanged(value) {
    const seconds = stringToSeconds(value)
    if (seconds !== parseInt(this.props.seconds)) {
      this.props.onChange(seconds)
    }
  }

  _onBlur = e => {
    this._updateIfChanged(e.currentTarget.value)
    if (this.props.onBlur) this.props.onBlur(e)
  }

  _onChange = () => {}

  _onKeyDown = e => {
    if (e.which === 13) {
      this._updateIfChanged(e.currentTarget.value)
    }
  }

  render() {
    const {seconds, ...props} = this.props
    return (
      <Text
        {...props}
        onBlur={this._onBlur}
        onChange={this._onChange}
        onKeyDown={this._onKeyDown}
        units='mm:ss'
        value={seconds >= 0 ? secondsToMmSsString(seconds) : ''}
      />
    )
  }
}
