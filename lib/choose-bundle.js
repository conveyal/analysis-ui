/** choose a bundle */

import React, { Component, PropTypes } from 'react'

export default class ChooseBundle extends Component {
  static propTypes = {
    setBundle: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired
  }

  render () {
    return <div>
      <legend>Choose Bundle</legend>
      <ul>
        {this.props.data.bundles
          .filter((b) => b.status === 'DONE')
          .map((b, i) => <li key={`bundle-${i}`}><a href='#' onClick={(e) => this.props.setBundle(b.id)}>{b.name}</a></li>)}
      </ul>
    </div>
  }
}
