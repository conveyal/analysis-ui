import {loadAll} from 'lib/actions/region'
import SelectRegion from 'lib/components/select-region'

SelectRegion.getInitialProps = async ctx => {
  const regions = await ctx.reduxStore.dispatch(loadAll())
  return {regions}
}

export default SelectRegion
