import React from 'react'
import {pure} from 'recompose'

const Title = pure(({children}) => {
  return (
    <h3
      className='DockContent-Title lead'
      >
      {children}
    </h3>
  )
})

export default Title
