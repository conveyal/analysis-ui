import startCase from 'lodash/startCase'
import React from 'react'

import {ALL_TRANSIT_MODES} from '../constants'

import {Select} from './input'

const toStartCase = o => startCase(o.toLowerCase())

/**
 * Only show an empty option if no mode has been selected. Do not allow de-selection.
 */
export default function TransitModeSelector(p) {
  const value = parseInt(p.value)
  return (
    <Select
      label='Transit Mode'
      onChange={e => {
        const mode = parseInt(e.target.value)
        if (mode >= 0) p.onChange(mode)
      }}
      value={p.value}
    >
      {(isNaN(value) || value === -1) && <option value={-1} />}
      {ALL_TRANSIT_MODES.map((m, i) => (
        <option key={m} value={i}>
          {toStartCase(m)}
        </option>
      ))}
    </Select>
  )
}
