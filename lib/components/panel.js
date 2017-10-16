// @flow
import React, {PureComponent} from 'react'

import type {Children} from 'react'

export class Panel extends PureComponent {
  props: {
    children?: Children,
    className?: string
  }

  render () {
    const {children, className, ...props} = this.props
    const extraClassName = className ? ` ${className}` : ''
    return (
      <div className={`panel panel-default${extraClassName}`} {...props}>
        {children}
      </div>
    )
  }
}

export class Heading extends PureComponent {
  props: {
    children?: Children,
    className?: string
  }

  render () {
    const {children, ...props} = this.props
    props.className =
      'panel-heading clearfix' + ' ' + (props.className ? props.className : '')
    return (
      <div {...props}>
        {children}
      </div>
    )
  }
}

export class Body extends PureComponent {
  props: {
    children?: Children
  }

  render () {
    const {children, ...props} = this.props
    return (
      <div className='panel-body' {...props}>
        {children}
      </div>
    )
  }
}
