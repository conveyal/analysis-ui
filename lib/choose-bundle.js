/** choose a bundle */

import React, { Component, PropTypes } from 'react'

export default class ChooseBundle extends Component {
  static propTypes = {
    setBundle: PropTypes.func.isRequired,
    deleteBundle: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired
  }

  deleteBundle (bundleId) {
    // todo window.confirm is bad
    if (window.confirm(`Delete bundle ${this.props.data.bundles.find((b) => b.id === bundleId).name}?`)) {
      this.props.deleteBundle(bundleId)
    }
  }

  render () {
    return <div>
      <legend>Choose Bundle</legend>
      <ul>
        {this.props.data.bundles
          .filter((b) => b.status === 'DONE')
          .map((b, i) => <li key={`bundle-${i}`}><a href='#' onClick={(e) => this.props.setBundle(b.id)}>{b.name}</a>&nbsp;<a href='#' onClick={(e) => this.deleteBundle(b.id)}>&times;</a></li>)}
      </ul>
    </div>
  }
}
