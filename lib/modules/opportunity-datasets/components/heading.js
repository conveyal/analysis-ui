import {faTh} from '@fortawesome/free-solid-svg-icons'
import dynamic from 'next/dynamic'
import React from 'react'

import {Application, Dock, Title} from '../../../components/base'
import Icon from '../../../components/icon'

const Dotmap = dynamic(() => import('./dotmap'), {ssr: false})

export default function Heading(p) {
  return (
    <Application map={() => <Dotmap />}>
      <Title>
        <Icon icon={faTh} fixedWidth /> Opportunity Datasets
      </Title>
      <Dock>{p.children}</Dock>
    </Application>
  )
}
