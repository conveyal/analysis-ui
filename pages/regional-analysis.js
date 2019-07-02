import {loadRegion} from 'lib/actions/region'
import {load} from 'lib/actions/analysis/regional'
import RegionalAnalysis from 'lib/containers/regional-analysis-results'
import withFetch from 'lib/with-fetch'

async function fetchData(dispatch, query) {
  const {analysisId, regionId} = query
  const [regionalAnalyses, region] = await Promise.all([
    dispatch(load(regionId)),
    dispatch(loadRegion(regionId))
  ])
  return {
    analysis: regionalAnalyses.find(a => a._id === analysisId),
    regionalAnalyses,
    region
  }
}

export default withFetch(RegionalAnalysis, fetchData)
