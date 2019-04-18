import React from 'react'

import Heading from '../lib/modules/opportunity-datasets/components/heading'
import List from '../lib/modules/opportunity-datasets/components/list'

function Opportunities(p) {
  return (
    <Heading {...p}>
      <List {...p} />
    </Heading>
  )
}

export default Opportunities
