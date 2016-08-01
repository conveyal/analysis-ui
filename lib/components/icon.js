import React from 'react'
import {pure} from 'recompose'

const Icon = pure(({type, className=''}) => <i className={`fa fa-${type} fa-fw ${className}`} />)

export default Icon
