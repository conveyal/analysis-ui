import React from 'react'

export default function Panel ({children, ...props}) {
  return <div className='panel panel-default' {...props}>{children}</div>
}

export function Heading ({children, ...props}) {
  return <div className='panel-heading clearfix' {...props}>{children}</div>
}

export function Body ({children, ...props}) {
  return <div className='panel-body' {...props}>{children}</div>
}
