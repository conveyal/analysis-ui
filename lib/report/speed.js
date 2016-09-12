/** render speed in appropriate units */

import { pure } from 'recompose'
import React from 'react'
import messages from '../utils/messages'

/** conversions from km/h to appropriate units */
const conversions = {
  kmh: 1,
  mph: 1 / 1.609,
  ff: 4.907 * 24 * 14 // furlongs per fortnight
}

const Speed = pure(({ kmh, units = ['kmh', 'mph'] }) => {
  let main = `${Math.round(kmh * conversions[units[0]] * 10) / 10} ${messages.report.units[units[0]]}`

  let addl = units.slice(1).map(unit => `${Math.round(kmh * conversions[unit] * 10) / 10} ${messages.report.units[unit]}`).join(',')

  return <span>{`${main} (${addl})`}</span>
})

export default Speed
