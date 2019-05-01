import {load} from '../lib/actions/region'
import EditRegion from '../lib/containers/edit-region'

EditRegion.getInitialProps = async ctx => {
  await ctx.reduxStore.dispatch(load(ctx.query.regionId))
}

export default EditRegion
