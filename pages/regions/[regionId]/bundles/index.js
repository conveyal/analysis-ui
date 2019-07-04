import React from 'react'

import {loadBundles} from 'lib/actions'
import Bundles from 'lib/components/bundles'
import EditBundle from 'lib/components/edit-bundle'
import withFetch from 'lib/with-fetch'

const BundlesView = p => (
  <Bundles>
    <EditBundle key={p.bundleId} />
  </Bundles>
)

function fetchData(dispatch, query) {
  return dispatch(loadBundles({regionId: query.regionId}))
}

export default withFetch(BundlesView, fetchData)
