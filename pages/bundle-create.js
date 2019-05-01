import React from 'react'

import {loadBundle} from '../lib/actions'
import Bundles from '../lib/components/bundles'
import CreateBundle from '../lib/containers/create-bundle'

function BundleCreate(p) {
  return (
    <Bundles {...p}>
      <CreateBundle {...p} />
    </Bundles>
  )
}

BundleCreate.getInitialProps = async ctx => {
  await ctx.reduxStore.dispatch(loadBundle(ctx.query.bundleId))
}

export default BundleCreate
