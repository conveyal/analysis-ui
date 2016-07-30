import React from 'react'
import {pure} from 'recompose'

const Panel = pure(function Panel ({children, ...props}) {
  return <div className='panel panel-default' {...props}>{children}</div>
})

export default Panel

export const Heading = pure(function Heading ({children, ...props}) {
  return <div className='panel-heading clearfix' {...props}>{children}</div>
})

export const Body = pure(function Body ({children, ...props}) {
  return <div className='panel-body' {...props}>{children}</div>
})
