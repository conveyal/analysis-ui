// @flow
import React, {PureComponent} from 'react'

import {Text} from './input'
import {secondsToMmSsString, mmSsStringToSeconds} from '../utils/time'

type Props = {
  onBlur?: (any) => void,
  onChange(number): void,
  seconds: number
}

function stringToSeconds (str: string): number {
  if (str.length === 0) {
    return 0
  } else if (String(parseFloat(str)) === str) {
    return parseFloat(str) * 60
  } else {
    try {
      const seconds = mmSsStringToSeconds(str)
      if (Number.isInteger(seconds)) return seconds
    } catch (error) {
      console.error(error)
    }
    return 0
  }
}

export default class MinutesSeconds extends PureComponent<void, Props, void> {
  _updateIfChanged (value: string) {
    const seconds: number = stringToSeconds(value)
    if (seconds !== parseInt(this.props.seconds)) {
      this.props.onChange(seconds)
    }
  }

  _onBlur = (e: Event & {currentTarget: HTMLInputElement}) => {
    this._updateIfChanged(e.currentTarget.value)
    if (this.props.onBlur) this.props.onBlur(e)
  }

  _onChange = (e: Event) => {}

  _onKeyDown = (e: Event & {
    currentTarget: HTMLInputElement,
    which: number
  }) => {
    if (e.which === 13) {
      this._updateIfChanged(e.currentTarget.value)
    }
  }

  render () {
    const {seconds, ...props} = this.props
    return <Text
      {...props}
      onBlur={this._onBlur}
      onChange={this._onChange}
      onKeyDown={this._onKeyDown}
      units='mm:ss'
      value={seconds >= 0 ? secondsToMmSsString(seconds) : ''}
      />
  }
}
