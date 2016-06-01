import React from 'react'
import {pure} from 'recompose'

const Icon = pure(({type, className}) => <i className={`fa fa-${type} ${className}`} />)

export default Icon
