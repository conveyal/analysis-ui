// @flow
import Icon from '@conveyal/woonerf/components/icon'
import React from 'react'

import type {Children} from 'react'

export default function Bundles ({children}: {children?: Children}) {
  return (
    <div>
      <div className='ApplicationDockTitle'>
        <Icon type='database' /> GTFS Bundles
      </div>
      <div className='InnerDock'>
        <div className='block'>
          {children}
        </div>
      </div>
    </div>
  )
}
