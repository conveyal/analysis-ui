import {load} from 'lib/actions/region'
import {loadBookmarks} from 'lib/actions/bookmark'
import {
  setScenarioApplicationErrors,
  setScenarioApplicationWarnings
} from 'lib/actions/analysis'
import SinglePointAnalysis from 'lib/containers/single-point-analysis'
import withInitialFetch from 'lib/with-initial-fetch'

function initialFetch(store, query) {
  store.dispatch(setScenarioApplicationWarnings(null))
  store.dispatch(setScenarioApplicationErrors(null))

  return Promise.all([
    store.dispatch(load(query.regionId)),
    store.dispatch(loadBookmarks(query.regionId))
  ])
}

export default withInitialFetch(SinglePointAnalysis, initialFetch)
