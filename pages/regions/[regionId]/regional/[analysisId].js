import {loadRegion} from 'lib/actions/region'
import {load} from 'lib/actions/analysis/regional'
import RegionalAnalysis from 'lib/containers/regional-analysis-results'
import withInitialFetch from 'lib/with-initial-fetch'

async function initialFetch(store, query) {
  const {analysisId, regionId} = query
  const [regionalAnalyses, region] = await Promise.all([
    store.dispatch(load(regionId)),
    store.dispatch(loadRegion(regionId))
  ])
  return {
    analysis: regionalAnalyses.find(a => a._id === analysisId),
    regionalAnalyses,
    region
  }
}

export default withInitialFetch(RegionalAnalysis, initialFetch)
