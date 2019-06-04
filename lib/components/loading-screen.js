import React from 'react'

import Logo from './logo'
import Spinner from './spinner'

const style = {
  position: 'absolute',
  left: 0,
  right: 0,
  top: '50%',
  marginTop: '-15%',
  textAlign: 'center'
}

export default function LoadingScreen() {
  return (
    <div style={style}>
      <Logo />
      <h1 style={{opacity: 0.5}}>
        <Spinner />
      </h1>
    </div>
  )
}
