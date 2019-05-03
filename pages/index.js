import {clearCurrentRegion, loadAll} from 'lib/actions/region'
import SelectRegion from 'lib/components/select-region'

SelectRegion.getInitialProps = async ctx => {
  ctx.reduxStore.dispatch(clearCurrentRegion())
  const regions = await ctx.reduxStore.dispatch(loadAll())
  return {regions}
}

export default SelectRegion
