import {loadRegion} from 'lib/actions/region'
import EditRegion from 'lib/components/edit-region'

EditRegion.getInitialProps = async ctx => {
  const region = await ctx.reduxStore.dispatch(loadRegion(ctx.query.regionId))
  return {region}
}

export default EditRegion
