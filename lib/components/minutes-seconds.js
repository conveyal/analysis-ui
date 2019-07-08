import moment from 'moment'
import React from 'react'

import {Text} from './input'

const FORMAT = 'mm:ss'

const secondsToMoment = s =>
  moment({minutes: parseInt(s / 60), seconds: s % 60})

export default function MinutesSeconds({onChange, seconds, ...p}) {
  function _onChange(e) {
    const timeString = e.currentTarget.value
    if (timeString == null) return
    const date = moment(timeString, FORMAT)
    const newSeconds = date.minutes() * 60 + date.seconds()
    if (!isNaN(newSeconds)) onChange(newSeconds)
  }

  const value = secondsToMoment(seconds)

  return (
    <Text
      {...p}
      onChange={_onChange}
      units={FORMAT}
      value={value.isValid() ? value.format(FORMAT) : ''}
    />
  )
}
