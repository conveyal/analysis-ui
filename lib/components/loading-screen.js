import React from 'react'

import Logo from './logo'
import Spinner from './spinner'

export default function LoadingScreen() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center'
      }}
    >
      <div>
        <Logo />
        <h1 style={{opacity: 0.5}}>
          <Spinner />
        </h1>
      </div>
    </div>
  )
}
