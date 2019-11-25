import {loadAllResources} from 'lib/actions/resources'
import SelectResource from 'lib/components/select-resource'
import withInitialFetch from 'lib/with-initial-fetch'

async function initialFetch(store, query) {
  return {
    resources: await store.dispatch(loadAllResources(query))
  }
}

export default withInitialFetch(SelectResource, initialFetch)
