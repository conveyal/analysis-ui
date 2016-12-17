/**
 * Pick a date in ISO format (2016-12-16).
 * This class is just a wrapper around an input for now, but in the future could wrap a
 */

import React, { Component, PropTypes } from 'react'
import DateTime from 'react-datetime'

export default class DatePicker extends Component {
  static propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired
  }

  onChange = (date) => {
    // grab just the date portion of the ISO
    // ISO is in UTC, see comment below
    this.props.onChange(date.toISOString().split('T')[0])
  }

  render () {
    // TODO how to eliminate onChange from rest without a lint error?
    const { value, label, onChange, ...rest } = this.props
    return <label>
      {label}
      <DateTime
        type='date'
        value={new Date(value)}
        onChange={this.onChange}
        timeFormat={false}
        utc // because new Date('2016-12-12') yields a date at midnight UTC
        {...rest}
        />
    </label>
  }
}
