import React from 'react'
import {pure} from 'recompose'

export const Group = pure(({children, justified}) => {
  const classNames = ['btn-group']
  if (justified) classNames.push('btn-group-justified')
  return (
    <div className={classNames.join(' ')}>{children}</div>
  )
})

export const Button = pure(({block, children, className, onClick, size, style, href = '#', target, ...props}) => {
  const classNames = ['btn']
  if (style) classNames.push(`btn-${style}`)
  else classNames.push('btn-default')
  if (block) classNames.push('btn-block')
  if (size) classNames.push(`btn-${size}`)
  if (className) classNames.push(className)
  let wrappedOnClick = (e) => {}
  if (onClick) {
    wrappedOnClick = (e) => {
      e.preventDefault()
      if (!props.disabled) {
        onClick(e)
      }
    }
  }
  return <a
    className={classNames.join(' ')}
    href={href}
    target={target}
    onClick={wrappedOnClick}
    {...props}
    >{children}</a>
})
