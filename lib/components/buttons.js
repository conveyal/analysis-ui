import React from 'react'

import {pure} from './deep-equal'

export const Group = pure(function ButtonGroup ({children, justified, vertical, radio}) {
  const classNames = ['btn-group']
  if (justified) classNames.push('btn-group-justified')
  if (vertical) classNames.push('btn-group-vertical')

  const opts = {}
  if (radio) opts['data-toggle'] = 'radio'

  return (
    <div className={classNames.join(' ')} {...opts}>{children}</div>
  )
})

export const Button = pure(function Button ({block, children, className, onClick, size, style, href = '#', target, checked, radio, ...props}) {
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

  if (radio && checked) classNames.push('active')

  if (radio) {
    return <label htmlFor='Button' className={classNames.join(' ')}>
      <input
        type='radio'
        onClick={wrappedOnClick}
        checked={checked}
        className='sr-only'
        {...props}
        />
      {children}
    </label>
  }
  return <a
    className={classNames.join(' ')}
    href={href}
    tabIndex={0}
    target={target}
    onClick={wrappedOnClick}
    {...props}
    >{children}</a>
})
