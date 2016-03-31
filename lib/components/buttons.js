import React from 'react'

export const Group = ({children}) => {
  return (
    <div className='btn-group btn-group-justified'>{children}</div>
  )
}

export const Button = ({children, onClick, size, style}) => {
  const classNames = ['btn']
  if (style) classNames.push(`btn-${style}`)
  else classNames.push('btn-default')
  if (size) classNames.push(`btn-${size}`)
  return <a
    className={classNames.join(' ')}
    href='#'
    onClick={(e) => {
      e.preventDefault()
      onClick(e)
    }}
    >{children}</a>
}
