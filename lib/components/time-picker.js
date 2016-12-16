/** Choose hours of day, using seconds since midnight */

import React, { Component, PropTypes } from 'react'
import { Text } from './input'

export default class TimePicker extends Component {
  static propTypes = {
    value: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired
  }

  setTime = (e) => {
    const timeSplit = e.target.value.split(':')
    const time = Number(timeSplit[0]) * 3600 + Number(timeSplit[1]) * 60
    this.props.onChange(time)
  }

  render () {
    // TODO don't want to include onChange in rest, how to avoid a lint error?
    const { value, onChange, ...rest } = this.props
    return <Text
      onChange={this.setTime}
      type='time'
      value={secondsToHhMmString(value)}
      {...rest}
      />
  }
}

/** Convert seconds since noon - 12h to HH:MM format, discarding fractional components */
export function secondsToHhMmString (secs) {
  // end time may be past midnight, move it back
  secs = secs % (60 * 60 * 24)
  const mins = Math.round(secs / 60)
  const hrs = Math.floor(mins / 60)
  const remainderMins = mins % 60
  return `${hrs < 10 ? '0' + hrs : hrs}:${remainderMins < 10 ? '0' + remainderMins : remainderMins}`
}
