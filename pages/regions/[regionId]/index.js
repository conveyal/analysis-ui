import {load} from 'lib/actions/region'
import SelectProject from 'lib/components/select-project'
import withInitialFetch from 'lib/with-initial-fetch'

export function initialFetch(store, query) {
  return store.dispatch(load(query.regionId))
}

export default withInitialFetch(SelectProject, initialFetch)
