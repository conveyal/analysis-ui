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
      <div role='heading' aria-level={3}>
        <div
          aria-expanded={expanded}
          onClick={this.toggleExpanded}
          role='button'
          style={{cursor: 'pointer', paddingBottom: '12px'}}>
          <Icon type={expanded ? 'chevron-down' : 'chevron-right'} />
          <strong>{title}</strong>
        </div>
      </div>
      { expanded && children }
    </div>
  }
}
