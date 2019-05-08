import {faDatabase} from '@fortawesome/free-solid-svg-icons'
import React from 'react'

import {Application, Dock} from './base'
import Icon from './icon'

export default function Bundles(p) {
  return (
    <Application>
      <Dock>
        <legend>
          <Icon icon={faDatabase} /> GTFS Bundles
        </legend>
        {p.children}
      </Dock>
    </Application>
  )
}
