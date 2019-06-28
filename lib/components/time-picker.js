import React from 'react'

import {secondsToHhMmString} from '../utils/time'

import {Text} from './input'

const preventDefaultIfFocused = e => {
  // http://stackoverflow.com/questions/17614844
  if (e.currentTarget === document.activeElement) e.preventDefault()
}

/** Choose hours of day, using seconds since midnight */
export default function TimePicker(props) {
  function _setTime(e) {
    const timeSplit = e.currentTarget.value.split(':')
    const time = Number(timeSplit[0]) * 3600 + Number(timeSplit[1]) * 60
    props.onChange(time)
  }

  const {value, ...rest} = props
  return (
    <Text
      type='time'
      // http://stackoverflow.com/questions/9712295
      onWheel={preventDefaultIfFocused}
      value={secondsToHhMmString(value)}
      {...rest}
      onChange={_setTime}
      units='hh:mm'
    />
  )
}
