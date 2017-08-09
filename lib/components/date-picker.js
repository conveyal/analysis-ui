/**
 * Pick a date in ISO format (2016-12-16).
 * This class is just a wrapper around an input for now, but in the future could wrap a
 */

import PropTypes from 'prop-types'
import React from 'react'
import DateTime from 'react-datetime'

import DeepEqualComponent from './deep-equal'

let datePickerCount = 0
export default class DatePicker extends DeepEqualComponent {
  static propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired
  }

  componentWillMount () {
    datePickerCount++
  }

  componentWillUnmount () {
    datePickerCount--
  }

  _onChange = date => {
    // grab just the date portion of the ISO
    // ISO is in UTC, see comment below
    this.props.onChange(date.toISOString().split('T')[0])
  }

  render () {
    const {value, label, ...rest} = this.props
    return (
      <label htmlFor={`date-picker-${datePickerCount}`}>
        {label}
        <DateTime
          type='date'
          value={new Date(value)}
          timeFormat={false}
          inputProps={{id: `date-picker-${datePickerCount}`}}
          utc // because new Date('2016-12-12') yields a date at midnight UTC
          {...rest}
          onChange={this._onChange}
        />
      </label>
    )
  }
}
