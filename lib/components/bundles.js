import {faDatabase} from '@fortawesome/free-solid-svg-icons'
import React from 'react'

import Icon from './icon'
import InnerDock from './inner-dock'

export default function Bundles(p) {
  return (
    <InnerDock className='block'>
      <legend>
        <Icon icon={faDatabase} /> GTFS Bundles
      </legend>
      {p.children}
    </InnerDock>
  )
}
