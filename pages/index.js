import {loadAll} from 'lib/actions/region'
import SelectRegion from 'lib/components/select-region'
import withInitialFetch from 'lib/with-initial-fetch'

async function initialFetch(store) {
  const regions = await store.dispatch(loadAll())
  return {regions}
}

export default withInitialFetch(SelectRegion, initialFetch)
