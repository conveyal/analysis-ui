import {faMap} from '@fortawesome/free-solid-svg-icons'
import React from 'react'

import message from 'lib/message'

import Icon from './icon'

export default function Region(p) {
  return p.region ? (
    <>
      <div className='ApplicationDockTitle'>
        <Icon icon={faMap} /> {p.region.name}
      </div>

      {p.children}
    </>
  ) : (
    <div className='block'>{message('region.loadingRegion')}</div>
  )
}
