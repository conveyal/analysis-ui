import omit from 'lodash/omit'
import React from 'react'

import Link from './link'

export function Group({children, justified, vertical = false, ...props}) {
  const classNames = ['btn-group']
  if (justified) classNames.push('btn-group-justified')
  if (vertical) classNames.push('btn-group-vertical')

  return (
    <div className={classNames.join(' ')} {...props}>
      {children}
    </div>
  )
}

export function ButtonLink({children, to, ...props}) {
  const {classNames, restProps} = getClassNamesFromProps(props)
  return (
    <Link to={to} {...restProps}>
      <a className={classNames} tabIndex={0}>
        {children}
      </a>
    </Link>
  )
}

export function Button({children, onClick, ...props}) {
  function _onClick(e) {
    e && e.preventDefault()
    if (!props.disabled) {
      onClick(e)
    }
  }

  const {classNames, restProps} = getClassNamesFromProps(props)
  return (
    <a
      {...restProps}
      className={classNames}
      href='#'
      tabIndex={0}
      onClick={_onClick}
    >
      {children}
    </a>
  )
}

function getClassNamesFromProps({
  active,
  block,
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
    restProps: omit(restProps, 'checked')
  }
}
