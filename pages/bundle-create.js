import React from 'react'

import Bundles from '../lib/components/bundles'
import EditBundle from '../lib/containers/edit-bundle'

function BundleCreate(p) {
  return (
    <Bundles {...p}>
      <EditBundle {...p} />
    </Bundles>
  )
}

export default BundleCreate
