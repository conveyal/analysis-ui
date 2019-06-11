import {loadRegion} from 'lib/actions/region'
import {load} from 'lib/actions/analysis/regional'
import RegionalAnalysis from 'lib/containers/regional-analysis-results'

RegionalAnalysis.getInitialProps = async ctx => {
  const {analysisId, regionId} = ctx.query
  const [regionalAnalyses, region] = await Promise.all([
    ctx.reduxStore.dispatch(load(regionId)),
    ctx.reduxStore.dispatch(loadRegion(regionId))
  ])
  return {
    analysis: regionalAnalyses.find(a => a._id === analysisId),
    regionalAnalyses,
    region
  }
}

export default RegionalAnalysis
