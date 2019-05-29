import {load} from 'lib/actions/analysis/regional'
import RegionalResultsList from 'lib/components/analysis/regional-results-list'

RegionalResultsList.getInitialProps = async ctx => {
  const {regionId} = ctx.query
  const regionalAnalyses = await ctx.reduxStore.dispatch(load(regionId))
  return {
    regionalAnalyses
  }
}

export default RegionalResultsList
