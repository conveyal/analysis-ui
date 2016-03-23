/** choose a bundle */

import React, { Component, PropTypes } from 'react'

export default class ChooseBundle extends Component {
  static propTypes = {
    setBundle: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired
  }

  render () {
    return <div>
      <ul>
        {this.props.data.bundles.map((b) => <li><a href='#' onClick={(e) => this.props.setBundle(b.id)}>{b.name}</a></li>)}
      </ul>
    </div>
  }
}
