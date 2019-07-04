import {load} from 'lib/actions/analysis/regional'
import RegionalResultsList from 'lib/components/analysis/regional-results-list'
import withFetch from 'lib/with-fetch'

async function fetchData(dispatch, query) {
  const regionalAnalyses = await dispatch(load(query.regionId))
  return {
    regionalAnalyses
  }
}

export default withFetch(RegionalResultsList, fetchData)
