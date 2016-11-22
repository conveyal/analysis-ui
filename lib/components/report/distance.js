/** render distance in appropriate units */

import React from 'react'

import {pure} from '../deep-equal'
import messages from '../../utils/messages'

/** conversions from km to target unit */
const conversions = {
  km: 1,
  mi: 1 / 1.609,
  furlong: 4.97096
}

/** if left with defaults, will return e.g. 16 km (10 mi) */
export default pure(function Distance ({ km, units = ['km', 'mi'] }) {
  let main = `${Math.round(km * conversions[units[0]] * 10) / 10} ${messages.report.units[units[0]]}`

  let addl = units.slice(1).map(unit => `${Math.round(km * conversions[unit] * 10) / 10} ${messages.report.units[unit]}`).join(',')

  return <span>{`${main} (${addl})`}</span>
})
