import {load} from 'lib/actions/region'
import SinglePointAnalysis from 'lib/containers/single-point-analysis'

SinglePointAnalysis.getInitialProps = async ctx => {
  return await ctx.reduxStore.dispatch(load(ctx.query.regionId))
}

export default SinglePointAnalysis
