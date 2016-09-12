/** A Modification in a report */

import React, { Component, PropTypes } from 'react'
import messages from '../utils/messages'

import AdjustFrequency from './adjust-frequency'
import AddTrips from './add-trips'

export default class Modification extends Component {
  static propTypes = {
    modification: PropTypes.object.isRequired,
    feedsById: PropTypes.object.isRequired
  }
  render () {
    let { modification, feedsById } = this.props

    if (modification.type !== 'add-trip-pattern' && feedsById[modification.feed] === undefined) return <div />

    return <div style={{ pageBreakAfter: true }}>
      <h3>{messages.modificationType[modification.type] || modification.type}</h3>
      <h2>{modification.name}</h2>

      {modification.type === 'convert-to-frequency' && <AdjustFrequency {...this.props} />}
      {modification.type === 'add-trip-pattern' && <AddTrips {...this.props} />}
    </div>
  }
}
