// @flow
import PropTypes from 'prop-types'
import React, {PureComponent} from 'react'
import DateTime from 'react-datetime'

let datePickerCount = 0
export default class DatePicker extends PureComponent {
  static propTypes = {
    disabled: PropTypes.bool,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired
  }

  componentWillMount () {
    datePickerCount++
  }

  componentWillUnmount () {
    datePickerCount--
  }

  _onChange = (date: Date) => {
    // If the date hasjust been cleared, don't save it
    if (!date || !date.toISOString) return
    // grab just the date portion of the ISO
    // ISO is in UTC, see comment below
    this.props.onChange(date.toISOString().split('T')[0])
  }

  render () {
    const {value, ...rest} = this.props
    return (
      <DateTime
        type='date'
        value={new Date(value)}
        timeFormat={false}
        inputProps={{
          disabled: rest.disabled,
          id: `date-picker-${datePickerCount}`
        }}
        utc // because new Date('2016-12-12') yields a date at midnight UTC
        {...rest}
        onChange={this._onChange}
      />
    )
  }
}