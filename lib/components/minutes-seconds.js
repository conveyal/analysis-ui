// @flow
import React, {PureComponent} from 'react'

import {Text} from './input'
import {secondsToMmSsString, mmSsStringToSeconds} from '../utils/time'

type Props = {
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
  _onBlur = (e: Event & {currentTarget: HTMLInputElement}) => {
    this.props.onChange(stringToSeconds(e.currentTarget.value))
  }

  _onChange = (e: Event) => {}

  render () {
    const {seconds, ...props} = this.props
    return <Text
      {...props}
      onBlur={this._onBlur}
      onChange={this._onChange}
      units='mm:ss'
      value={seconds > 0 ? secondsToMmSsString(seconds) : ''}
      />
  }
}
