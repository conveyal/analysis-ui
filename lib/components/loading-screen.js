import React from 'react'

import Logo from './logo'
import Spinner from './spinner'

const style = {
  fontSize: '36px',
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
      <h1 style={{color: '#2389c9'}}>
        <Spinner />
      </h1>
    </div>
  )
}
