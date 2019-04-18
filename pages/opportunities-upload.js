import React from 'react'

import Heading from '../lib/modules/opportunity-datasets/components/heading'
import Upload from '../lib/modules/opportunity-datasets/components/upload'

function OpportunitiesUpload(p) {
  return (
    <Heading {...p}>
      <Upload {...p} />
    </Heading>
  )
}

export default OpportunitiesUpload
