/** A simple collapsible element for hiding children */

import React, { Component, PropTypes } from 'react'
import Icon from './icon'

export default class Collapsible extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    defaultExpanded: PropTypes.bool
  }

  static defaultProps = {
    defaultExpanded: false
  }

  componentWillMount () {
    this.state = {
      expanded: this.props.defaultExpanded
    }
  }

  toggleExpanded = () => {
    this.setState({ ...this.state, expanded: !this.state.expanded })
  }

  render () {
    const {expanded} = this.state
    const {title, children} = this.props
    return <div>
      <div role='heading' ariaLevel={3}>
        <div role='button' onClick={this.toggleExpanded} ariaExpanded={expanded}>
          <Icon type={expanded ? 'caret-down' : 'caret-right'} />
          {title}
        </div>
      </div>
      { expanded && children }
    </div>
  }
}
