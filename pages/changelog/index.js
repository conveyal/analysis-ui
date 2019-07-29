import React from 'react'

import change1 from './2019-07-29.mdx'

const changes = [change1]

export default function Changelog() {
  return (
    <div className='container'>
      <div className='row'>
        <div className='col-xs-12'>
          <h1>
            Changelog{' '}
            <small>
              <a href='/'>Back to app</a>
            </small>
          </h1>
        </div>
      </div>
      {changes.map((Changes, i) => (
        <div className='row' key={i}>
          <div className='col-xs-12'>
            <Changes />
          </div>
        </div>
      ))}
    </div>
  )
}
