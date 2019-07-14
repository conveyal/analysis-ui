import {faTh} from '@fortawesome/free-solid-svg-icons'
import React from 'react'

import Icon from 'lib/components/icon'
import InnerDock from 'lib/components/inner-dock'

export default function Heading(p) {
  return (
    <InnerDock className='block'>
      <legend>
        <Icon icon={faTh} /> Opportunity Datasets
      </legend>
      {p.children}
    </InnerDock>
  )
}
