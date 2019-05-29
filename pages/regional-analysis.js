import {load, setActiveRegionalAnalyses} from 'lib/actions/analysis/regional'
import RegionalAnalysis from 'lib/containers/regional-analysis-results'

RegionalAnalysis.getInitialProps = async ctx => {
  const {analysisId, regionId} = ctx.query
  const regionalAnalyses = await ctx.reduxStore.dispatch(load(regionId))
  ctx.reduxStore.dispatch(setActiveRegionalAnalyses(analysisId))
  return {
    analysis: regionalAnalyses.find(a => a._id === analysisId),
    regionalAnalyses
  }
}

export default RegionalAnalysis
