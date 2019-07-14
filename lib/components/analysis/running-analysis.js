import {faCloud, faTimes} from '@fortawesome/free-solid-svg-icons'
import React from 'react'

import Icon from '../icon'
import ProgressBar from '../progress-bar'

export default function RunningAnalysis(p) {
  const {analysis} = p
  const complete = analysis.status.complete
  const total = analysis.status.total
  const text = `${analysis.name} - ${complete} of ${total} complete`
  return (
    <li className='list-group-item' style={{display: 'block'}}>
      <div className='list-group-item-heading'>
        <>
          <Icon icon={faCloud} /> {text}
        </>
        <a
          className='pull-right'
          onClick={p.onDelete}
          tabIndex={0}
          title='Cancel regional analysis'
        >
          <Icon icon={faTimes} />
        </a>
      </div>
      <ProgressBar complete={complete} total={total} />
    </li>
  )
}
