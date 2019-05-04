import React from 'react'
import DateTime from 'react-datetime'

import 'react-datetime/css/react-datetime.css'

let datePickerCount = 0
export default function DatePicker(p) {
  // Run once on mount and cleanup on unmount
  React.useEffect(() => {
    datePickerCount++
    return () => datePickerCount--
  }, [])

  function onChange(date) {
    // If the date hasjust been cleared, don't save it
    if (!date || !date.toISOString) return
    // grab just the date portion of the ISO
    // ISO is in UTC, see comment below
    p.onChange(date.toISOString().split('T')[0])
  }

  return (
    <DateTime
      type='date'
      closeOnSelect
      value={new Date(p.value)}
      timeFormat={false}
      inputProps={{
        disabled: p.disabled,
        id: `date-picker-${datePickerCount}`
      }}
      utc // because new Date('2016-12-12') yields a date at midnight UTC
      onChange={onChange}
    />
  )
}
