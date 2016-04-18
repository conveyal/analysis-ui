import React from 'react'

export const Group = ({children, justified}) => {
  const classNames = ['btn-group']
  if (justified) classNames.push('btn-group-justified')
  return (
    <div className={classNames.join(' ')}>{children}</div>
  )
}

export const Button = ({block, children, className, onClick, size, style, ...props}) => {
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
      onClick(e)
    }
  }
  return <a
    className={classNames.join(' ')}
    href='#'
    onClick={wrappedOnClick}
    {...props}
    >{children}</a>
}
