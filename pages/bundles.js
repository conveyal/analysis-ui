import React from 'react'

import {loadBundles} from '../lib/actions'
import Bundles from '../lib/components/bundles'
import EditBundle from '../lib/containers/edit-bundle'

function BundlesView(p) {
  return (
    <Bundles {...p}>
      <EditBundle {...p} />
    </Bundles>
  )
}

BundlesView.getInitialProps = async ctx => {
  await ctx.reduxStore.dispatch(
    loadBundles({
      regionId: ctx.query.regionId
    })
  )
}

export default BundlesView
