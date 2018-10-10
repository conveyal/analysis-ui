// @flow
import Icon from '@conveyal/woonerf/components/icon'
import message from '@conveyal/woonerf/message'
import React from 'react'

import type {Region} from '../types'

type Props = {
  children?: any,
  region?: Region,
}

export default ({children, region}: Props) => region
  ? <div>
    <div className='ApplicationDockTitle'>
      <Icon type='map-o' /> {region.name}
    </div>

    {children}
  </div>
  : <div className='block'>
    {message('region.loadingRegion')}
  </div>
