import React from 'react'

const Button = ({onClick, children}) => {
  return (
    <button
      className='DockContent-Title-Button btn btn-default pull-right'
      onClick={onClick}
      >
      {children}
    </button>
  )
}

export default Button
