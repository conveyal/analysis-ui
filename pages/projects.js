import {load} from 'lib/actions/region'
import SelectProject from 'lib/components/select-project'

SelectProject.getInitialProps = async ctx => {
  return await ctx.reduxStore.dispatch(load(ctx.query.regionId))
}

export default SelectProject
