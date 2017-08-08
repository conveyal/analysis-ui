import React from 'react'

import {pure} from './deep-equal'

function Icon ({type, className = '', ...props}) {
  return <i className={`fa fa-${type} fa-fw ${className}`} {...props} />
}

export default pure(Icon)
