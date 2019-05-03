import {load} from '../lib/actions/region'
import SelectProject from '../lib/containers/select-project'

SelectProject.getInitialProps = async ctx => {
  await ctx.reduxStore.dispatch(load(ctx.query.regionId))
}

export default SelectProject
