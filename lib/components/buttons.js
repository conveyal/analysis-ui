import omit from 'lodash/omit'
import Link from 'next/link'
import React from 'react'

export function Group({children, justified, vertical, ...props}) {
  const classNames = ['btn-group']
  if (justified) classNames.push('btn-group-justified')
  if (vertical) classNames.push('btn-group-vertical')

  return (
    <div className={classNames.join(' ')} {...props}>
      {children}
    </div>
  )
}

export function Button({children, href = '#', ...props}) {
  function onClick(e) {
    if (props.onClick) {
      e && e.preventDefault()
      if (!props.disabled) {
        props.onClick(e)
      }
    }
  }

  const {classNames, restProps} = getClassNamesFromProps(props)
  return (
    <a
      {...restProps}
      className={classNames}
      href={href}
      tabIndex={0}
      onClick={onClick}
    >
      {children}
    </a>
  )
}

export function ButtonLink({as, children, href, ...p}) {
  const {classNames, restProps} = getClassNamesFromProps(p)
  return (
    <Link as={as} href={href}>
      <a {...restProps} className={classNames}>
        {children}
      </a>
    </Link>
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
