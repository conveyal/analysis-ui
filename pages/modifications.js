import {loadProjectAndModifications} from 'lib/actions/project'
import Modifications from 'lib/containers/modifications'

Modifications.getInitialProps = async ctx => {
  const {project} = await ctx.reduxStore.dispatch(
    loadProjectAndModifications(ctx.query.projectId)
  )
  return {project}
}

export default Modifications
