import React from 'react'

export const Group = ({children, justified}) => {
  const classNames = ['btn-group']
  if (justified) classNames.push('btn-group-justified')
  return (
    <div className={classNames.join(' ')}>{children}</div>
  )
}

export const Button = ({children, className, onClick, size, style, ...props}) => {
  const classNames = ['btn']
  if (style) classNames.push(`btn-${style}`)
  else classNames.push('btn-default')
  if (size) classNames.push(`btn-${size}`)
  if (className) classNames.push(className)
  return <a
    className={classNames.join(' ')}
    href='#'
    onClick={(e) => {
      e.preventDefault()
      onClick(e)
    }}
    {...props}
    >{children}</a>
}
