import React from 'react'

import C2019 from './2019.mdx'

const changes = [C2019]

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
            <C2019 />
          </div>
        </div>
      ))}
    </div>
  )
}
