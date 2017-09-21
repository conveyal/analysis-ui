// @flow
import React, {PureComponent} from 'react'
import type {Children} from 'react'

export class Group extends PureComponent {
  props: {
    children?: Children,
    justified?: boolean,
    vertical?: boolean
  }

  render () {
    const {children, justified, vertical, ...props} = this.props
    const classNames = ['btn-group']
    if (justified) classNames.push('btn-group-justified')
    if (vertical) classNames.push('btn-group-vertical')

    return (
      <div className={classNames.join(' ')} {...props}>
        {children}
      </div>
    )
  }
}

export class Button extends PureComponent {
  props: {
    active?: boolean,
    block?: boolean,
    children?: Children,
    className?: string,
    disabled?: boolean,
    href?: string,
    onClick?: Event => void
  }

  _onClick = (e: Event) => {
    const {disabled, onClick} = this.props
    if (onClick) {
      e.preventDefault()
      if (!disabled) {
        onClick(e)
      }
    }
  }

  render () {
    const {children, href = '#', ...props} = this.props
    const {classNames, restProps} = getClassNamesFromProps(props)
    return (
      <a
        {...restProps}
        className={classNames}
        href={href}
        tabIndex={0}
        onClick={this._onClick}
      >
        {children}
      </a>
    )
  }
}

function getClassNamesFromProps ({
  active,
  block,
  checked,
  className,
  size,
  style,
  ...restProps
}) {
  const classNames = ['btn']
  if (style) classNames.push(`btn-${style}`)
  else classNames.push('btn-default')
  if (block) classNames.push('btn-block')
  if (size) classNames.push(`btn-${size}`)
  if (className) classNames.push(className)
  if (active) classNames.push('active')
  return {
    classNames: classNames.join(' '),
    restProps
  }
}
