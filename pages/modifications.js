import {load} from '../lib/actions/project'
import Modifications from '../lib/containers/modifications'

Modifications.getInitialProps = async ctx => {
  await ctx.reduxStore.dispatch(load(ctx.query.projectId))
}

export default Modifications
