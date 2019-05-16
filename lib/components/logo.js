import React from 'react'

const logo = {
  fontFamily: `'Gill Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif`,
  display: 'inline-block',
  letterSpacing: 0,
  paddingLeft: '5.5rem',
  backgroundImage:
    'url(https://d2f1n6ed3ipuic.cloudfront.net/conveyal-128x128.png)',
  backgroundSize: '4rem',
  lineHeight: '4rem',
  backgroundRepeat: 'no-repeat',
  fontWeight: 100
}

export default function Logo() {
  return (
    <div className='page-header text-center' style={{borderBottom: 'none'}}>
      <h1 style={logo}>conveyal analysis</h1>
    </div>
  )
}
