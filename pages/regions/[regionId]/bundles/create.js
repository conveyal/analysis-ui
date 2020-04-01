import React from 'react'

import {loadBundles} from 'lib/actions'
import {loadRegion} from 'lib/actions/region'
import CreateBundle from 'lib/components/create-bundle'
import withInitialFetch from 'lib/with-initial-fetch'

const CreateBundlePage = p => <CreateBundle regionId={p.query.regionId} />

function initialFetch(store, query) {
  return Promise.all([
    store.dispatch(loadBundles({regionId: query.regionId})),
    store.dispatch(loadRegion(query.regionId))
  ])
}

export default withInitialFetch(CreateBundlePage, initialFetch)
