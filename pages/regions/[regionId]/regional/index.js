import {load} from 'lib/actions/analysis/regional'
import RegionalResultsList from 'lib/components/analysis/regional-results-list'
import withInitialFetch from 'lib/with-initial-fetch'

async function initialFetch(store, query) {
  const regionalAnalyses = await store.dispatch(load(query.regionId))
  return {
    regionalAnalyses
  }
}

export default withInitialFetch(RegionalResultsList, initialFetch)
