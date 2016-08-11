import React from 'react'
import {pure} from 'recompose'

const Icon = ({type, className = '', ...props}) =>
  <i
    className={`fa fa-${type} fa-fw ${className}`}
    {...props}
    />

export default pure(Icon)
