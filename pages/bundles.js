import React from 'react'

import {loadBundles} from 'lib/actions'
import Bundles from 'lib/components/bundles'
import EditBundle from 'lib/components/edit-bundle'

const BundlesView = p => (
  <Bundles>
    <EditBundle key={p.bundleId} />
  </Bundles>
)

BundlesView.getInitialProps = async ctx => {
  await ctx.reduxStore.dispatch(
    loadBundles({
      regionId: ctx.query.regionId
    })
  )

  return {bundleId: ctx.query.bundleId}
}

export default BundlesView
