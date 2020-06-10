import {Heading} from '@chakra-ui/core'
import {faTh} from '@fortawesome/free-solid-svg-icons'
import React from 'react'

import Icon from 'lib/components/icon'
import InnerDock from 'lib/components/inner-dock'

export default (p) => (
  <InnerDock className='block'>
    <Heading mb={4} size='md'>
      <Icon icon={faTh} /> Opportunity Datasets
    </Heading>

    {p.children}
  </InnerDock>
)
