import {faDatabase} from '@fortawesome/free-solid-svg-icons'
import React from 'react'

import {Application, Dock, Title} from './base'
import Icon from './icon'

export default function Bundles(p) {
  return (
    <Application pathname={p.pathname} query={p.query}>
      <Title>
        <Icon icon={faDatabase} fixedWidth /> GTFS Bundles
      </Title>
      <Dock>{p.children}</Dock>
    </Application>
  )
}
