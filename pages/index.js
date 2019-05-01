import {
  clearCurrentRegion,
  loadAll as loadAllRegions
} from '../lib/actions/region'
import SelectRegion from '../lib/containers/select-region'

SelectRegion.getInitialProps = async ctx => {
  ctx.reduxStore.dispatch(clearCurrentRegion())
  await ctx.reduxStore.dispatch(loadAllRegions())
}

export default SelectRegion
