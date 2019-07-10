import {loadBundles} from 'lib/actions'
import CreateProject from 'lib/components/create-project'
import withInitialFetch from 'lib/with-initial-fetch'

async function initialFetch(store, query) {
  const bundles = await store.dispatch(loadBundles({regionId: query.regionId}))
  return {bundles}
}

export default withInitialFetch(CreateProject, initialFetch)
