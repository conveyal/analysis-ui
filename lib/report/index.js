/** Main report generation component */

import React, { Component, PropTypes } from 'react'
import dbg from 'debug'
import Modification from './modification'

export default class Report extends Component {
  static propTypes = {
    modifications: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired,
    feedsById: PropTypes.object.isRequired
  }

  render () {
    let { modifications, feedsById } = this.props
    return <div>
      {modifications.map(mod => <Modification modification={mod} feedsById={feedsById} />)}
    </div>
  }
}
