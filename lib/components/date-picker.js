// @flow
import React, {PureComponent} from 'react'
import DateTime from 'react-datetime'

type Props = {
  disabled?: boolean,
  onChange: (string) => void,
  value: string
}

let datePickerCount = 0
export default class DatePicker extends PureComponent {
  props: Props

  constructor (props) {
    super(props)
    datePickerCount++
  }

  componentWillUnmount () {
    datePickerCount--
  }

  _onChange = (date: Date) => {
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
