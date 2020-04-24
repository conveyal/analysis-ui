import React from 'react'

import Heading from 'lib/modules/opportunity-datasets/components/heading'
import Upload from 'lib/modules/opportunity-datasets/components/upload'
import MapLayout from 'lib/layouts/map'

export default function OpportunitiesUpload(p) {
  return (
    <Heading>
      <Upload {...p} regionId={p.query.regionId} />
    </Heading>
  )
}

OpportunitiesUpload.Layout = MapLayout
