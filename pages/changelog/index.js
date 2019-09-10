import React from 'react'

import C201909 from './201909.mdx'

const changes = [['September 13th, 2019', C201909]]

export default function Changelog() {
  return (
    <div className='container'>
      <div className='row'>
        <div className='col-sm-8 col-xs-12'>
          <h1>
            Changelog{'    '}
            <small>
              <a href='/'>Back to Analysis</a>
            </small>
          </h1>
          <hr />
        </div>
      </div>
      {changes.map(([title, C], i) => (
        <div className='row' key={i}>
          <div className='col-sm-8 col-xs-12'>
            <div className='panel panel-info'>
              <div className='panel-heading'>
                <h5 className='panel-title'>{title}</h5>
              </div>
              <div className='panel-body'>
                <C />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
