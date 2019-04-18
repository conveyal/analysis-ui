import React from 'react'

import {setBundles} from '../lib/actions'
import Bundles from '../lib/components/bundles'
import EditBundle from '../lib/containers/edit-bundle'
import * as API from '../lib/api'

function BundlesView(p) {
  return (
    <Bundles {...p}>
      <EditBundle {...p} />
    </Bundles>
  )
}

BundlesView.getInitialProps = async ctx => {
  const bundles = await API.getBundles(ctx.query.regionId)
  ctx.reduxStore.dispatch(setBundles(bundles))

  return {bundles}
}

export default BundlesView
