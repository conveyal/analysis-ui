import toStartCase from 'lodash/startCase'
import React from 'react'

import {Collapsible} from '../panel'

export default function ModificationGroup(p) {
  return (
    <Collapsible
      defaultExpanded={p.defaultExpanded}
      heading={() => toStartCase(p.type)}
    >
      <div className='list-group'>{p.children}</div>
    </Collapsible>
  )
}
