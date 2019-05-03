import {load} from 'lib/actions/project'
import Modifications from 'lib/containers/modifications'

Modifications.getInitialProps = async ctx => {
  const {project} = await ctx.reduxStore.dispatch(load(ctx.query.projectId))
  return {project}
}

export default Modifications
