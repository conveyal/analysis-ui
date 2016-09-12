/** Main report generation component */

import React, { Component, PropTypes } from 'react'
import Modification from './modification'

export default class Report extends Component {
  static propTypes = {
    scenarioId: PropTypes.string.isRequired,
    modifications: PropTypes.array,
    feedsById: PropTypes.object,
    load: PropTypes.func.isRequired
  }

  componentWillMount () {
    let { load, scenarioId } = this.props
    load(scenarioId)
  }

  render () {
    let { modifications, feedsById } = this.props

    if (modifications == null) return <div />

    return <div>
      {modifications.map(mod => <Modification modification={mod} feedsById={feedsById} />)}
      <i>Map data: <span dangerouslySetInnerHTML={{__html: process.env.LEAFLET_ATTRIBUTION}} /></i>
    </div>
  }
}
