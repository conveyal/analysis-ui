import {faTh} from '@fortawesome/free-solid-svg-icons'
import dynamic from 'next/dynamic'
import React from 'react'

import {Application, Dock} from 'lib/components/base'
import Icon from 'lib/components/icon'

const Dotmap = dynamic(() => import('./dotmap'), {ssr: false})

export default function Heading(p) {
  return (
    <Application map={() => <Dotmap />}>
      <Dock>
        <legend>
          <Icon icon={faTh} /> Opportunity Datasets
        </legend>
        {p.children}
      </Dock>
    </Application>
  )
}
