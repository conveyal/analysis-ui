import {loadRegion} from 'lib/actions/region'
import EditRegion from 'lib/components/edit-region'
import withInitialFetch from 'lib/with-initial-fetch'

async function initialFetch(store, query) {
  const region = await store.dispatch(loadRegion(query.regionId))
  return {region}
}

export default withInitialFetch(EditRegion, initialFetch)
