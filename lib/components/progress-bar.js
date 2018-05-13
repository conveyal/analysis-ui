// @flow
import React from 'react'

export default function ProgressBar (p: {complete: number, total: number}) {
  const percentage = p.complete / p.total * 100
  return (
    <div className='progress'>
      <div
        className='progress-bar'
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        style={{width: `${percentage}%`, minWidth: '2em'}}
      >
        {Math.round(percentage)}%
      </div>
    </div>
  )
}
