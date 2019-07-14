import {load} from 'lib/actions/region'
import SinglePointAnalysis from 'lib/containers/single-point-analysis'
import withInitialFetch from 'lib/with-initial-fetch'

function initialFetch(store, query) {
  return store.dispatch(load(query.regionId))
}

export default withInitialFetch(SinglePointAnalysis, initialFetch)
